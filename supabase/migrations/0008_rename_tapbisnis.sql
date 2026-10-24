-- Ganti nama produk TapBooks menjadi TapBisnis (kode internal tetap 'books')
update public.tap_products set name = 'TapBisnis' where code = 'books';
