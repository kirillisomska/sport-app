import UpdateUserForm from "@/components/user/UpdateUserForm";
import { getFullUserInfoById } from "@/data/user";
import { currentUser } from "@/lib/auth";

const EditProfilePage = async () => {
    const user = await currentUser();

    if (!user) {
        return <h1>Недостаточно прав для просмотре данной страницы</h1>
    }

    const fullUserInfo = await getFullUserInfoById(user.id);

    if (!fullUserInfo) {
        return <h1>Недостаточно прав для просмотре данной страницы</h1>
    }

    return (
        <>
            <UpdateUserForm user={fullUserInfo} />
        </>
    )
}

export default EditProfilePage;