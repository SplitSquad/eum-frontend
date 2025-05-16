export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
/**
 * Checks if a mark exists in the editor schema
 *
 * @param markName - The name of the mark to check
 * @param editor - The editor instance
 */
export const isMarkInSchema = (markName, editor) => editor?.schema.spec.marks.get(markName) !== undefined;
/**
 * Checks if a node exists in the editor schema
 *
 * @param nodeName - The name of the node to check
 * @param editor - The editor instance
 */
export const isNodeInSchema = (nodeName, editor) => editor?.schema.spec.nodes.get(nodeName) !== undefined;
/**
 * Handles image upload with progress tracking and abort capability
 */
export const handleImageUpload = async (_file, onProgress, abortSignal) => {
    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
        if (abortSignal?.aborted) {
            throw new Error("Upload cancelled");
        }
        await new Promise((resolve) => setTimeout(resolve, 500));
        onProgress?.({ progress });
    }
    return "/images/placeholder-image.png";
    // Uncomment to use actual file conversion:
    // return convertFileToBase64(file, abortSignal)
};
/**
 * Converts a File to base64 string
 */
export const convertFileToBase64 = (file, abortSignal) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        const abortHandler = () => {
            reader.abort();
            reject(new Error("Upload cancelled"));
        };
        if (abortSignal) {
            abortSignal.addEventListener("abort", abortHandler);
        }
        reader.onloadend = () => {
            if (abortSignal) {
                abortSignal.removeEventListener("abort", abortHandler);
            }
            if (typeof reader.result === "string") {
                resolve(reader.result);
            }
            else {
                reject(new Error("Failed to convert File to base64"));
            }
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};
