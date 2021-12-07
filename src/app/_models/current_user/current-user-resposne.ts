interface CurrentUserResposne {
    status: number;
    message: string;
    obj: SavedCurrentUser;
}

interface SavedCurrentUser {
    username: string;
    access_token: string;
    token_type: string;
    refresh_token: string;
    expires_in: string;
    updated_at: number;
    created_at: number;
    account_id: string;
    account_name: string;
    designation: string;
    group_name: string;
    group_id: number;
    user_id: number;
    client_id: number;
    client_name: string;
    client_logo: string;
    group_category_id: number;
    user_email: string;
}