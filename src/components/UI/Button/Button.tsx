import { ButtonTypeMap, Button as MUIButton } from "@mui/material";
import { DefaultComponentProps } from "@mui/material/OverridableComponent";


interface ButtonProps extends DefaultComponentProps<ButtonTypeMap> {} 

export default function Button(props: ButtonProps) {
    return (
        <MUIButton
            variant="outlined"
            sx={{
                color: "white",
                fontFamily: "Inter",
                textTransform: "capitalize"
            }}
            size="large"
            {...props}
        >
            {props.children}
        </MUIButton>
    )
}