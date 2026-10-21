-- Datos de ejemplo: los 5 coches de la propuesta a Miquel. Precios y km orientativos.
-- Requiere un usuario admin ya creado en Auth; sustituye :owner por su uuid o usa el bloque DO.

do $$
declare
  owner uuid;
begin
  select id into owner from public.profiles where role = 'admin' order by created_at limit 1;
  if owner is null then
    raise exception 'Crea primero un usuario admin (profiles.role = admin) antes de cargar el seed';
  end if;

  insert into public.vehicles (slug, owner_id, status, make, model, version, year, km, fuel, gearbox, power_cv, color, price_eur, vat_deductible, origin_country, imported, registered_es, warranty, description_es, description_ca, featured)
  values
    ('ferrari-458-italia-spider-2013', owner, 'available', 'Ferrari', '458 Italia Spider', '4.5 V8', 2013, 24500, 'gasolina', 'automatico', 570, 'Giallo Modena', 229000, false, 'DE', true, true, '12 meses', 'V8 atmosférico de 570 CV, techo duro retráctil, Carbon Ceramic, historial completo Ferrari.', 'V8 atmosfèric de 570 CV, sostre dur retràctil, Carbon Ceramic, historial complet Ferrari.', true),
    ('mclaren-650s-coupe-2016', owner, 'available', 'McLaren', '650S Coupé', '3.8 V8 Twin Turbo', 2016, 18900, 'gasolina', 'automatico', 650, 'Onyx Black', 169000, false, 'DE', true, true, '12 meses', '650 CV, chasis de carbono MonoCell, paquete carbono interior y exterior, un solo propietario.', '650 CV, xassís de carboni MonoCell, paquet carboni interior i exterior, un sol propietari.', true),
    ('audi-rs3-sportback-2023', owner, 'available', 'Audi', 'RS3 Sportback', '2.5 TFSI quattro', 2023, 21000, 'gasolina', 'automatico', 400, 'Verde Kyalami', 64900, true, 'DE', true, true, 'Garantía de fábrica hasta 2027', 'Cinco cilindros de 400 CV, RS Torque Splitter, paquete RS Design, Matrix LED.', 'Cinc cilindres de 400 CV, RS Torque Splitter, paquet RS Design, Matrix LED.', false),
    ('mercedes-amg-a45-s-2023', owner, 'available', 'Mercedes-AMG', 'A 45 S 4MATIC+', '2.0 Turbo', 2023, 15800, 'gasolina', 'automatico', 421, 'Negro Cosmos', 68500, true, 'DE', true, true, 'Garantía de fábrica hasta 2027', 'El cuatro cilindros más potente del mundo: 421 CV, Drift Mode, paquete Aerodynamics, Burmester.', 'El quatre cilindres més potent del món: 421 CV, Drift Mode, paquet Aerodynamics, Burmester.', false),
    ('porsche-macan-gts-2022', owner, 'available', 'Porsche', 'Macan GTS', '2.9 V6 Biturbo', 2022, 32000, 'gasolina', 'automatico', 440, 'Gris Volcán', 84900, true, 'DE', true, true, 'Porsche Approved', '440 CV, suspensión neumática, Sport Chrono, techo panorámico, BOSE, asientos 18 posiciones.', '440 CV, suspensió pneumàtica, Sport Chrono, sostre panoràmic, BOSE, seients 18 posicions.', false);
end $$;
