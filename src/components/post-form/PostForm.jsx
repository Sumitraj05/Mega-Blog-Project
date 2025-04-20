import React, { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PostForm({ post }) {
    const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.$id || "",
            content: post?.content || "",
            status: post?.status || "active",
        },
    });

    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);

    // Debug userData
    console.log("🔍 Redux userData:", userData);
    console.log("✅ Extracted userId:", userData?.$id);

    const submit = async (data) => {
        try {
            console.log("📤 Form Data Before Processing:", data);

            let featuredImageId = post?.featuredImage || "";

            if (data.image && data.image[0]) {
                console.log("🖼️ New Image Selected for Upload:", data.image[0]);
                const uploadedFile = await appwriteService.uploadFile(data.image[0]);

                if (uploadedFile) {
                    featuredImageId = uploadedFile.$id;
                    console.log("✅ Uploaded Image ID:", featuredImageId);

                    if (post?.featuredImage) {
                        console.log("🧹 Deleting old image:", post.featuredImage);
                        await appwriteService.deleteFile(post.featuredImage);
                    }
                } else {
                    console.error("❌ Image upload failed");
                }
            }

            if (!featuredImageId) {
                console.error("❌ No featured image found. Cannot proceed.");
                return;
            }

            const postData = {
                title: data.title,
                slug: data.slug,
                content: data.content,
                featuredImage: featuredImageId,
                status: data.status,
                userId: userData?.$id,
            };

            console.log("🧾 Final Post Data Being Sent:", postData);

            if (!postData.userId) {
                console.error("❌ Missing userId in postData!");
                return;
            }

            let dbPost;
            if (post) {
                console.log("📝 Updating Post:", post.$id);
                dbPost = await appwriteService.updatePost(post.$id, postData);
            } else {
                console.log("🆕 Creating New Post");
                dbPost = await appwriteService.createPost(postData);
            }

            console.log("✅ Post Created/Updated Successfully:", dbPost);

            if (dbPost) {
                navigate(`/post/${dbPost.$id}`);
            }
        } catch (error) {
            console.error("❌ Error creating/updating post:", error);
        }
    };

    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string")
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");

        return "";
    }, []);

    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            <div className="w-2/3 px-2">
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required: true })}
                />
                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
            </div>
            <div className="w-1/3 px-2">
                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4 cursor-pointer"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })}
                />
                {post && (
                    <div className="w-full mb-4">
                        <img
                            src={appwriteService.getFilePreview(post.featuredImage)}
                            alt={post.title}
                            className="rounded-lg"
                        />
                    </div>
                )}
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4 cursor-pointer"
                    {...register("status", { required: true })}
                />
                <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full cursor-pointer">
                    {post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
    );
}
