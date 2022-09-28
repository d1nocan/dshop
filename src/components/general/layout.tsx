import { ReactNode } from "react";
import Navbar from "./navbar";
type layoutProps = {
    children: ReactNode;
};

export default function Layout({ children }: layoutProps) {
    return (
        <>
            <Navbar />
            <div>{children}</div>
        </>
    );
}
