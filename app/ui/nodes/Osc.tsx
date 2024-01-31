import React from "react";
import { Handle } from "reactflow";

import useStore from "./store";


export default function Osc({id, data}: {
    id: string,
    data: string
}) {
    return (
        <div>
            <div>
                <p>Oscilator Node</p>
            </div>
        </div>
    )
}