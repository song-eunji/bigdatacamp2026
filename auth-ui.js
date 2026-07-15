(() => {
    const SUPABASE_URL = 'https://svtfrpcjqgzotbdqzdgt.supabase.co';
    const SUPABASE_ANON_KEY = 'sb_publishable_fXOS6yGOHTCxs7t0w_a0wA_N2O8by1u';
    const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const profileImage = 'profile-default.svg';
    const defaultAvatarMarkup = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="31" fill="#F0EDFF"/><circle cx="32" cy="24" r="10" fill="none" stroke="#7C5CFC" stroke-width="3"/><path d="M15 53c2-11 9-17 17-17s15 6 17 17" fill="none" stroke="#7C5CFC" stroke-width="3" stroke-linecap="round"/></svg>';
    const AVATAR_DB = 'localProfileData';
    const AVATAR_STORE = 'avatars';

    function isRealUser(user) {
        return Boolean(user && !user.is_anonymous);
    }

    function getLocalAvatar(userId) {
        return new Promise((resolve) => {
            const request = indexedDB.open(AVATAR_DB, 1);
            request.onupgradeneeded = () => request.result.createObjectStore(AVATAR_STORE);
            request.onsuccess = () => {
                let getRequest;
                try {
                    getRequest = request.result.transaction(AVATAR_STORE).objectStore(AVATAR_STORE).get(userId);
                } catch (_) {
                    resolve(null);
                    return;
                }
                getRequest.onsuccess = () => resolve(getRequest.result || null);
                getRequest.onerror = () => resolve(null);
            };
            request.onerror = () => resolve(null);
        });
    }

    async function render(user) {
        const actions = document.getElementById('authActions');
        if (!actions) return;
        if (isRealUser(user)) {
            const storedAvatar = await getLocalAvatar(user.id);
            const avatar = typeof storedAvatar === 'string' && storedAvatar.startsWith('data:image/') ? storedAvatar : profileImage;
            const avatarMarkup = avatar === profileImage ? defaultAvatarMarkup : `<img src="${avatar}" alt="프로필">`;
            actions.innerHTML = `<button class="auth-profile" type="button" aria-label="마이페이지">${avatarMarkup}</button>`;
            actions.querySelector('.auth-profile').addEventListener('click', () => {
                window.location.href = 'mypage.html';
            });
        } else {
            actions.innerHTML = '<a href="login.html">로그인</a><a href="signup.html">가입하기</a>';
        }
    }

    client.auth.getSession().then(({ data }) => render(data.session?.user));
    client.auth.onAuthStateChange((_event, session) => render(session?.user));
})();
