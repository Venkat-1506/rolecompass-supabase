alter table public.profiles
  add column if not exists phone text,
  add column if not exists location text,
  add column if not exists github_url text,
  add column if not exists linkedin_url text;

update public.profiles
set full_name = coalesce(
  nullif(full_name, ''),
  nullif(profile_data #>> '{personal,fullName}', '')
)
where full_name is null or full_name = '';

update public.profiles
set phone = coalesce(
  nullif(phone, ''),
  nullif(profile_data #>> '{personal,phone}', ''),
  nullif(profile_data #>> '{links,phone}', '')
)
where phone is null or phone = '';

update public.profiles
set location = coalesce(
  nullif(location, ''),
  nullif(profile_data #>> '{personal,location}', '')
)
where location is null or location = '';

update public.profiles
set github_url = coalesce(
  nullif(github_url, ''),
  nullif(profile_data #>> '{personal,githubUrl}', ''),
  nullif(profile_data #>> '{personal,portfolioUrl}', ''),
  nullif(profile_data #>> '{links,github}', ''),
  nullif(profile_data #>> '{links,portfolio}', '')
)
where github_url is null or github_url = '';

update public.profiles
set linkedin_url = coalesce(
  nullif(linkedin_url, ''),
  nullif(profile_data #>> '{personal,linkedinUrl}', ''),
  nullif(profile_data #>> '{links,linkedin}', '')
)
where linkedin_url is null or linkedin_url = '';
