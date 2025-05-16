import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useUserStore } from '../../shared/store/UserStore';
const UserProfile = () => {
    const { userProfile, isAuthenticated } = useUserStore();
    if (!isAuthenticated) {
        return _jsx("div", { children: "\uB2F9\uC2E0\uC758 \uD504\uB85C\uD544\uC744 \uBCF4\uAE30 \uC704\uD574 \uB85C\uADF8\uC778\uC744 \uD558\uC138\uC694." }); // 로그인이 되지 않은 경우
    }
    if (!userProfile) {
        return _jsx("div", { children: "\uC720\uC800 \uC815\uBCF4\uB97C \uB85C\uB529\uC911\uC785\uB2C8\uB2E4...." }); // 유저 정보가 없는 경우
    }
    return (_jsxs("div", { children: [_jsxs("h1", { children: ["\uD658\uC601\uD574\uC694, ", userProfile.name] }), _jsxs("p", { children: ["\uC774\uBA54\uC77C: ", userProfile.email] }), _jsxs("p", { children: ["\uC8FC\uC18C: ", userProfile.address || 'Not provided'] }), _jsxs("p", { children: ["\uAD6D\uAC00: ", userProfile.nation] }), _jsxs("p", { children: ["\uC5B8\uC5B4: ", userProfile.language] }), _jsxs("p", { children: ["\uBC29\uBB38 \uBAA9\uC801: ", userProfile.visitPurpose] }), userProfile.profileImagePath && _jsx("img", { src: userProfile.profileImagePath, alt: "Profile" }), _jsxs("div", { children: [_jsxs("p", { children: ["\uC54C\uB9BC: ", userProfile.onBoardingPreference.notifications ? 'Enabled' : 'Disabled'] }), _jsxs("p", { children: ["\uB2E4\uD06C \uBAA8\uB4DC: ", userProfile.onBoardingPreference.darkMode ? 'Enabled' : 'Disabled'] })] })] }));
};
export default UserProfile;
