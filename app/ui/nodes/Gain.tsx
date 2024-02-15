import React, { ChangeEvent, memo } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import styled from 'styled-components';

import useStore, { GainData, NodesState } from "./store";
import { useShallow } from "zustand/react/shallow";

const selector = (id: string) => (store: NodesState) =>  ({
    setGain: (e: ChangeEvent<HTMLInputElement>) => {
        store.updateNode(id, { gain: parseFloat(e.target.value) });
    }
  });

const Gain = ({id, data}: NodeProps<GainData>) => {
    const { setGain } = useStore(useShallow(selector(id)));

    return (
        <Node>
            <div>
                <NodeCaption>Amplifier Node</NodeCaption>
                <GainLabel>
                    <LabelName>Gain</LabelName>
                    <input
                        className="nodrag"
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={data.gain}
                        onChange={setGain} />
                    <GainValue>{data.gain?.toFixed(2)}</GainValue>
                </GainLabel>
            </div>

            <Handle type="source" position={Position.Bottom} />
            <Handle type="target" position={Position.Top} />
        </Node>
    )
}

export default memo(Gain);

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
    background-color: rgb(153 72 236);
    color: rgb(255 255 255);
    font-size: 0.875rem; /* 14px */
    line-height: 1.25rem; /* 20px */
`;

const GainLabel = styled.label`
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

const GainValue = styled.p`
    text-align: right;
    font-size: 0.75rem; /* 12px */
    line-height: 1rem; /* 16px */
`;