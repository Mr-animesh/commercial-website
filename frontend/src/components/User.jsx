export const User = ({firstName, lastName, isAdmin, balance}) => {
    return <div>
        <div className="">
            Name {firstName} {lastName}
        </div>
        <div className="">
            role {isAdmin}
        </div>
        <div className="">
            Rs {balance}
        </div>
    </div>
}