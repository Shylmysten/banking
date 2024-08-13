"use server"

import { ID } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../server/appwrite";
import { parseStringify } from './../utils';
import { cookies } from "next/headers";
import { redirect } from "next/navigation";



export const signIn = async ({ email, password }: signInProps) => {
    try {
        const { account } = await createAdminClient();
        const response = await account.createEmailPasswordSession(email, password);
        //console.log(email, password);
        //console.log("Sign In PAGE Console", parseStringify(response));
        cookies().set("appwrite-session", response.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        });


        return parseStringify(response);
    } catch (error) {
        console.error('Sign In Error', error);
    }
}
export const signUp = async (userData: SignUpParams) => {
    
    const { email, password, firstName, lastName } = userData;
    
    try {
        const { account } = await createAdminClient();

        const newUserAccount = await account.create(
            ID.unique(), 
            email, 
            password, 
            `${firstName} ${lastName}`
        );
        
        const session = await account.createEmailPasswordSession(email, password);

        cookies().set("appwrite-session", session.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        });

        return parseStringify(newUserAccount);

    } catch (error) {
        console.error('Sign Up Error', error);
    }
}

export async function getLoggedInUser() {
    try {
        const { account } = await createSessionClient();
        //console.log('getLoggedInUser ACCOUNT',account);

        const user = await account.get();

        return parseStringify(user);
    } catch (error) {
        //console.error('getLoggedInUser', error);
        return null;
    }
}

export const logoutAccount = async () => {
    try {
        const { account } = await createSessionClient();

        cookies().delete('appwrite-session');
        const loggedOut = await account.deleteSession('current');

        return loggedOut;
       
    } catch (error) {
        console.log('logoutAccount', error);
        return null;
    }
}