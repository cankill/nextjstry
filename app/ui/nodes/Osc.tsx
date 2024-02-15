import React, { ChangeEvent, memo } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import styled from 'styled-components';

import useStore, { OscData, NodesState } from "./store";
import { useShallow } from "zustand/react/shallow";

const selector = (id: string) => (store: NodesState) =>  ({
    setFrequency: (e: ChangeEvent<HTMLInputElement>) => {
        store.updateNode(id, { frequency: parseInt(e.target.value) });
    },
    setType: (e: ChangeEvent) => store.updateNode(id, { type: e.target.nodeValue ? e.target.nodeValue : undefined })
  });

const Osc = ({id, data}: NodeProps<OscData>) => {
    const {setFrequency, setType } = useStore(useShallow(selector(id)));

    return (
        <Node>
            <div>
                <NodeCaption>Oscilator Node</NodeCaption>
                <FreqLabel>
                    <LabelName>Frequency</LabelName>
                    <input
                        className="nodrag"
                        type="range"
                        min="10"
                        max="1000"
                        value={data.frequency}
                        onChange={setFrequency} />
                    <FreqValue>{data.frequency}&nbsp;Hz</FreqValue>
                </FreqLabel>
                <Hr/>
                <WaveLabel>
                    <LabelName>Waveform</LabelName>
                    <select className="nodrag" value={data.type} onChange={setType}>
                        <option value="sine">sine</option>
                        <option value="triangle">triangle</option>
                        <option value="sawtooth">sawtooth</option>
                        <option value="square">square</option>
                    </select>
                </WaveLabel>
            </div>

            <Handle type="source" position={Position.Bottom} />
        </Node>
    )
}

export default memo(Osc);

const Node = styled.div<{ $selected?: boolean }>`
    border-radius: 0.375rem; /* 6px */
    background-color: rgb(255 255 255);
    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
`;

const NodeCaption = styled.p`
    border-top-left-radius: 0.375rem; /* 6px */
    border-top-right-radius: 0.375rem; /* 6px */
    padding-left: 0.5rem; /* 8px */
    padding-right: 0.5rem; /* 8px */
    padding-top: 0.25rem; /* 4px */
    padding-bottom: 0.25rem; /* 4px */
    background-color: rgb(236 72 153);
    color: rgb(255 255 255);
    font-size: 0.875rem; /* 14px */
    line-height: 1.25rem; /* 20px */
`;

const Hr = styled.hr`
    border-color: rgb(229 231 235);
    margin-left: 0.5rem; /* 8px */
    margin-right: 0.5rem; /* 8px */
`;

const FreqLabel = styled.label`
    display: flex;
    flex-direction: column;
    padding-left: 0.5rem; /* 8px */
    padding-right: 0.5rem; /* 8px */
    padding-top: 0.25rem; /* 4px */
    padding-bottom: 0.25rem; /* 4px */
`;

const LabelName = styled.p`
    font-size: 0.75rem; /* 12px */
    line-height: 1rem; /* 16px */
    font-weight: 700;
    margin-bottom: 0.5rem; /* 8px */
`;

const FreqValue = styled.p`
    text-align: right;
    font-size: 0.75rem; /* 12px */
    line-height: 1rem; /* 16px */
`;


const WaveLabel = styled.label`
    display: flex;
    flex-direction: column;
    padding-left: 0.5rem; /* 8px */
    padding-right: 0.5rem; /* 8px */
    padding-top: 0.25rem; /* 4px */
    padding-bottom: 1rem; /* 16px */
`;