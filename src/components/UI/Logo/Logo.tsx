import { ReactComponent as LogoIcon } from "../../../assets/images/logo.svg";

interface LogoProps {
    className?: string;
}

export default function Logo({ className }: LogoProps) {
    return (
        <a className={className} href="/">
            <LogoIcon />
        </a>   
    )
}