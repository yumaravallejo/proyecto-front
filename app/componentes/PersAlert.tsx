import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"
import { alertVariants } from "@/components/ui/alert"
import type { VariantProps } from "class-variance-authority"
import Spinner from "./Spinner"

type AlertVariant = VariantProps<typeof alertVariants>["variant"]

export default function PersAlert(props: {message: string, title: string, variant: AlertVariant, spinner: boolean}) {
    const Icon = props.variant === "success" ? CheckCircle : AlertCircle

    return (
        <Alert variant={props.variant}>
            <Icon className="h-4 w-4" />
            <AlertTitle>{props.title}</AlertTitle>
            <AlertDescription className="flex justify-between items-center ">
                {props.message}
                {props.spinner ? <Spinner /> : null}
            </AlertDescription>
        </Alert>
    )
}