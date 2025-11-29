import { Button } from "react-bootstrap"

export default function ButtonFormat({btnCorlor, btnText, btnOnClickFunction}){
    return(
        <div>
            <Button variant={btnCorlor} onClick={()=>btnOnClickFunction}>
                {btnText}
            </Button>
        </div>
    )
}