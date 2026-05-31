-- Restrict reads on sensitive tables to admin/analista roles
DROP POLICY IF EXISTS "auth read leads" ON public.leads;
CREATE POLICY "writers read leads" ON public.leads
  FOR SELECT TO authenticated
  USING (deleted_at IS NULL AND public.can_write(auth.uid()));

DROP POLICY IF EXISTS "auth read construtoras" ON public.construtoras;
CREATE POLICY "writers read construtoras" ON public.construtoras
  FOR SELECT TO authenticated
  USING (deleted_at IS NULL AND public.can_write(auth.uid()));

DROP POLICY IF EXISTS "auth read historico" ON public.historico_alteracoes;
CREATE POLICY "admin read historico" ON public.historico_alteracoes
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));