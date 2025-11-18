import { Link } from "react-router";
import Label from "../../components/form/Label";
import Button from "../../components/ui/button/Button";
import TextArea from "../../components/form/input/TextArea";

export const License = () => {
    return (
        <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
            <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">

                <div className="flex flex-col flex-1">
                    <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                        <div>
                            <div className="mb-5 sm:mb-8">
                                <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                                    License
                                </h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Please enter your license!
                                </p>
                            </div>
                            <div>
                                <div>
                                    <div className="space-y-6">
                                        <div>
                                            <Label>
                                                License <span className="text-error-500">*</span>{" "}
                                            </Label>
                                            <TextArea placeholder="Put your license here" />
                                        </div>
                                        <div>
                                            <Button className="w-full" size="sm">
                                                Submit
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-5">
                                    <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                                        Don&apos;t have an license? {""}
                                        <Link
                                            to="/signup"
                                            className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                                        >
                                            Request
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>


    );
}