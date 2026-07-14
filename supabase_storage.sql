-- Supabase Dashboard > SQL Editor에서 한 번 실행하세요.
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do update set public = true;

create policy "avatars are publicly readable"
on storage.objects for select
to public
using (bucket_id = 'avatars');

create policy "users can upload their own avatar"
on storage.objects for insert
to authenticated
with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
);

create policy "users can update their own avatar"
on storage.objects for update
to authenticated
using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
)
with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
);
