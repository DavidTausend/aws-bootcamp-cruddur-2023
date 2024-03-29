-- this file was manually created
INSERT INTO public.users (display_name,email, handle, cognito_user_id)
VALUES
  ('Andrew Brown', 'andrew@example.co', 'andrewbrown' ,'MOCK'),
  ('David Tausend', 'davidtausend-911@hotmail.com', 'davidtausend' ,'MOCK'),
  ('Ruta Tausend', 'rutatausend@gmail.com', 'rutatausend' ,'MOCK'),
  ('David Padilla', 'david.tausend@servisa-gruppe.de', 'davidpadilla' ,'MOCK'),
  ('Andrew Bayko', 'bayko@example.co', 'bayko' ,'MOCK');

INSERT INTO public.activities (user_uuid, message, expires_at)
VALUES
  (
    (SELECT uuid from public.users WHERE users.handle = 'davidtausend' LIMIT 1),
    'This was imported as seed data!',
    current_timestamp + interval '10 day'
  ),
  (
    (SELECT uuid from public.users WHERE users.handle = 'davidpadilla' LIMIT 1),
    'I am the other!',
    current_timestamp + interval '10 day'
  );