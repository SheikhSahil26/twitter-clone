import type{ UpdateUserInput } from "../schemas/user.schema.js";

export function mapUpdateFields(input : UpdateUserInput){
    const updateData : Record<string,any>= {}

    if(input.username!==undefined){
        updateData.username = input.username
    }

    if(input.f_name !== undefined){
        updateData.f_name = input.f_name
    }
    if(input.l_name !== undefined){
        updateData.l_name = input.l_name
    }
    if(input.bio !== undefined){
        updateData.bio = input.bio
    }
    if(input.profile_photo_url !== undefined){
        updateData.profile_photo_url = input.profile_photo_url
    }
    if(input.cover_image_url !== undefined){
        updateData.cover_image_url = input.cover_image_url
    }

    updateData.updated_at = new Date();

    console.log(updateData,"this is update data")

    return updateData;
}