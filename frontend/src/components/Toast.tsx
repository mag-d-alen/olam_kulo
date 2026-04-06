import { toast, ToastContainer, ToastContainerProps } from 'react-toastify';


type ToastProps = {
    successMessage?: string;
    errorMessage?: string;
    position?: ToastContainerProps['position'];

}
export const Toast = ({
    successMessage,
    errorMessage,
    position = 'top-center',
}: ToastProps

) => {

    successMessage && toast.success(successMessage);
    errorMessage && toast.error(errorMessage)
    if (!successMessage && !errorMessage) {
        return null;
    }
    return (
        <ToastContainer position={position} autoClose={400} />
    )
}
