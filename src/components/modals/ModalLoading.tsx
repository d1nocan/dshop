const ModalLoading = () => {
    return (
        <div className="absolute z-50 -m-6 flex h-full w-full bg-neutral-100 opacity-100 duration-300 dark:bg-neutral-800">
            <div className="m-auto aspect-square w-[5vh] animate-spin rounded-full border-2 border-b-0 border-l-0 border-neutral-900 dark:border-neutral-100"></div>
        </div>
    );
};

export default ModalLoading;
