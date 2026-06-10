
-- Restrict scoring_leads SELECT to admin/analista
DROP POLICY IF EXISTS "auth read" ON public.scoring_leads;
DROP POLICY IF EXISTS "scoring_leads_select" ON public.scoring_leads;
CREATE POLICY "scoring_leads_select_writers" ON public.scoring_leads
  FOR SELECT TO authenticated
  USING (public.can_write(auth.uid()));

-- Restrict alertas_estrategicos SELECT to admin/analista
DROP POLICY IF EXISTS "auth read" ON public.alertas_estrategicos;
DROP POLICY IF EXISTS "alertas_estrategicos_select" ON public.alertas_estrategicos;
CREATE POLICY "alertas_estrategicos_select_writers" ON public.alertas_estrategicos
  FOR SELECT TO authenticated
  USING (public.can_write(auth.uid()));
