import { z, type AnyZodObject } from "astro:schema";

export const createForm = async <TSchema extends AnyZodObject>({
    request,
    schema,
    onSubmit,
}: {
    request: Request;
    schema: TSchema;
    onSubmit: (data: z.infer<TSchema>) => Promise<void>;
}) => {
    let isSubmitted: boolean = false;
    let error: string | false = false;
    let data: { [key: string]: string } = {};
    let errors: { [key: string]: string } = {};

    const submit = async (formData: FormData) => {
        try {
            const formObj = Object.fromEntries(formData);
            for (const key in formObj) {
                data[key] = String(formObj[key] || "");
            }
            const validatedData = schema.parse(data);
            await onSubmit(validatedData);
            isSubmitted = true;
            data = {};
        } catch (err) {
            if (err instanceof z.ZodError) {
                for (const issue of err.issues) {
                    if (issue.path) {
                        errors[issue.path.join(".")] = issue.message;
                    }
                }
                error = "Please check for validation errors";
            } else {
                error = "An error occurred";
            }
        }
    };

    if (request.method === "POST") {
        const formData = await request.formData();
        await submit(formData);
    }

    return {
        isSubmitted,
        error,
        data,
        errors,
        submit,
    };
};
