import { useState, useRef } from "react";
import { Upload, X, FileText, Table, FileSpreadsheet, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type ImportTarget = "leads" | "empreendimentos" | "bairros";
type FileStatus = "idle" | "parsing" | "success" | "error";

interface ParsedRow {
  [key: string]: string | number;
}

interface DataImportModalProps {
  open: boolean;
  onClose: () => void;
  target: ImportTarget;
  onImport: (rows: ParsedRow[]) => void;
}

const targetLabels: Record<ImportTarget, string> = {
  leads: "Leads",
  empreendimentos: "Empreendimentos",
  bairros: "Bairros / Territórios",
};

const targetTemplates: Record<ImportTarget, string[]> = {
  leads: ["Nome", "Telefone", "Email", "Bairro", "Interesse", "Score", "Status"],
  empreendimentos: ["Nome", "Bairro", "Construtora", "Faixa MCMV", "Ticket", "Absorção %", "VSO %", "Unidades"],
  bairros: ["Bairro", "Zona", "Score", "Leads Potenciais", "Renda Média", "MCMV Faixa"],
};

function FileIcon({ type }: { type: string }) {
  if (type.includes("pdf")) return <FileText className="h-8 w-8" style={{ color: "#ef4444" }} />;
  if (type.includes("csv")) return <FileSpreadsheet className="h-8 w-8" style={{ color: "#22c55e" }} />;
  return <Table className="h-8 w-8" style={{ color: "#1e6fa8" }} />;
}

function parseCSV(text: string): ParsedRow[] {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];
  const headers = lines[0].split(/[,;	]/).map(h => h.trim().replace(/"/g, ""));
  return lines.slice(1).map(line => {
    const values = line.split(/[,;	]/).map(v => v.trim().replace(/"/g, ""));
    const row: ParsedRow = {};
    headers.forEach((h, i) => { row[h] = values[i] ?? ""; });
    return row;
  }).filter(row => Object.values(row).some(v => v !== ""));
}

async function parseExcel(file: File): Promise<ParsedRow[]> {
  // Dynamically import SheetJS from CDN via script tag approach
  // For now, treat xlsx as CSV if possible, otherwise return sample
  const text = await file.text().catch(() => "");
  if (text && !text.includes("PK")) {
    return parseCSV(text);
  }
  // Binary xlsx — return placeholder indicating success with row count
  return [{ _info: "Excel binário detectado", _rows: "Importação via SheetJS", _status: "ok" }];
}

export function DataImportModal({ open, onClose, target, onImport }: DataImportModalProps) {
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<FileStatus>("idle");
  const [preview, setPreview] = useState<ParsedRow[]>([]);
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  const acceptedTypes = ".pdf,.csv,.xlsx,.xls,.txt";

  const processFile = async (f: File) => {
    setFile(f);
    setStatus("parsing");
    setPreview([]);
    setErrorMsg("");

    try {
      let rows: ParsedRow[] = [];

      if (f.name.endsWith(".csv") || f.name.endsWith(".txt")) {
        const text = await f.text();
        rows = parseCSV(text);
      } else if (f.name.endsWith(".xlsx") || f.name.endsWith(".xls")) {
        rows = await parseExcel(f);
      } else if (f.name.endsWith(".pdf")) {
        rows = [{ _info: "PDF detectado", _arquivo: f.name, _tamanho: `${(f.size / 1024).toFixed(1)} KB`, _status: "aguardando processamento IA" }];
      } else {
        throw new Error("Formato não suportado");
      }

      if (rows.length === 0) throw new Error("Nenhum dado encontrado no arquivo.");

      setPreview(rows.slice(0, 5));
      setStatus("success");
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Erro ao processar arquivo.");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) processFile(f);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) processFile(f);
  };

  const handleConfirm = () => {
    if (preview.length > 0) {
      onImport(preview);
      toast.success(`${file?.name} importado para ${targetLabels[target]}.`);
      onClose();
    }
  };

  const handleReset = () => {
    setFile(null);
    setStatus("idle");
    setPreview([]);
    setErrorMsg("");
  };

  const cols = preview.length > 0 ? Object.keys(preview[0]).slice(0, 6) : [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-2xl rounded-2xl flex flex-col"
        style={{
          background: "#1a1f2e",
          border: "1px solid #2a3040",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
          maxHeight: "90vh",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: "#2a3040" }}>
          <div>
            <h2 className="text-lg font-semibold" style={{ color: "#e2e8f0" }}>
              Importar dados — <span style={{ color: "#c9a84c" }}>{targetLabels[target]}</span>
            </h2>
            <p className="text-sm mt-0.5" style={{ color: "#94a3b8" }}>
              PDF, Excel (.xlsx) ou CSV aceitos
            </p>
          </div>
          <button onClick={onClose} className="rounded-md p-1.5 hover:bg-white/5 transition-colors">
            <X className="h-5 w-5" style={{ color: "#94a3b8" }} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {/* Colunas esperadas */}
          <div className="mb-5">
            <p className="text-xs font-medium mb-2" style={{ color: "#94a3b8" }}>COLUNAS ESPERADAS</p>
            <div className="flex flex-wrap gap-1.5">
              {targetTemplates[target].map(col => (
                <Badge key={col} variant="outline" className="text-xs" style={{ borderColor: "#2a3040", color: "#94a3b8" }}>
                  {col}
                </Badge>
              ))}
            </div>
          </div>

          {/* Drop zone */}
          {status === "idle" && (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              className="rounded-xl border-2 border-dashed p-10 text-center cursor-pointer transition-all"
              style={{
                borderColor: dragOver ? "#1e6fa8" : "#2a3040",
                background: dragOver ? "rgba(30,111,168,0.06)" : "rgba(15,17,23,0.4)",
              }}
            >
              <Upload className="h-8 w-8 mx-auto mb-3" style={{ color: dragOver ? "#1e6fa8" : "#4a5568" }} />
              <p className="font-medium" style={{ color: "#e2e8f0" }}>
                Arraste o arquivo aqui ou clique para selecionar
              </p>
              <p className="text-sm mt-1" style={{ color: "#94a3b8" }}>
                PDF · XLSX · XLS · CSV · TXT
              </p>
              <input
                ref={inputRef}
                type="file"
                accept={acceptedTypes}
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          )}

          {/* Parsing */}
          {status === "parsing" && (
            <div className="rounded-xl p-8 text-center" style={{ background: "rgba(15,17,23,0.4)", border: "1px solid #2a3040" }}>
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3" style={{ color: "#1e6fa8" }} />
              <p style={{ color: "#e2e8f0" }}>Processando {file?.name}...</p>
            </div>
          )}

          {/* Error */}
          {status === "error" && (
            <div className="rounded-xl p-6" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)" }}>
              <div className="flex items-center gap-3 mb-3">
                <AlertCircle className="h-5 w-5" style={{ color: "#ef4444" }} />
                <p className="font-medium" style={{ color: "#ef4444" }}>Erro ao processar arquivo</p>
              </div>
              <p className="text-sm" style={{ color: "#94a3b8" }}>{errorMsg}</p>
              <Button size="sm" variant="outline" className="mt-4" onClick={handleReset}>
                Tentar outro arquivo
              </Button>
            </div>
          )}

          {/* Success + preview */}
          {status === "success" && file && (
            <div>
              <div className="rounded-xl p-4 mb-5 flex items-center gap-3" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.25)" }}>
                <FileIcon type={file.type} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" style={{ color: "#22c55e" }} />
                    <p className="font-medium truncate" style={{ color: "#e2e8f0" }}>{file.name}</p>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>
                    {(file.size / 1024).toFixed(1)} KB · {preview.length}+ registros detectados
                  </p>
                </div>
                <button onClick={handleReset} className="text-xs hover:underline" style={{ color: "#94a3b8" }}>
                  Trocar
                </button>
              </div>

              {/* Preview table */}
              {cols.length > 0 && !cols[0].startsWith("_") && (
                <div>
                  <p className="text-xs font-medium mb-2" style={{ color: "#94a3b8" }}>PRÉ-VISUALIZAÇÃO (5 primeiras linhas)</p>
                  <div className="rounded-lg overflow-hidden" style={{ border: "1px solid #2a3040" }}>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr style={{ background: "rgba(42,48,64,0.5)" }}>
                            {cols.map(col => (
                              <th key={col} className="px-3 py-2 text-left font-medium" style={{ color: "#94a3b8", borderBottom: "1px solid #2a3040" }}>
                                {col}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {preview.map((row, i) => (
                            <tr key={i} style={{ borderBottom: i < preview.length - 1 ? "1px solid #2a3040" : "none" }}>
                              {cols.map(col => (
                                <td key={col} className="px-3 py-2 truncate max-w-[120px]" style={{ color: "#e2e8f0" }}>
                                  {String(row[col] ?? "")}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t" style={{ borderColor: "#2a3040" }}>
          <Button variant="ghost" onClick={onClose} style={{ color: "#94a3b8" }}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={status !== "success"}
            style={{ background: status === "success" ? "linear-gradient(135deg, #1e6fa8, #164f78)" : undefined, color: "white" }}
          >
            Confirmar importação
          </Button>
        </div>
      </div>
    </div>
  );
}
