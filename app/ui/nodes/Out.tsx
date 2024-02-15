import React, { memo } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import styled from 'styled-components';

import useStore, { OutData, NodesState } from "./store";
import { useShallow } from "zustand/react/shallow";

const selector = (store: NodesState) =>  ({
    isRunning: store.isRunning,
    toggleAudio: store.toggleAudio
  });

const Out = ({id, data}: NodeProps<OutData>) => {
    const { isRunning, toggleAudio } = useStore(useShallow(selector));

    return (
        <Node>
            <button onClick={toggleAudio}>
                { isRunning ? (
                    <span role="img" aria-label="mute">🔈</span>
                ) : (
                    <span role="img" aria-label="unmute">🔇</span>
                ) }
            </button>

            <Handle type="target" position={Position.Top} />
        </Node>
    )
}

export default memo(Out);

const Node = styled.div<{ $selected?: boolean }>`
    border-radius: 0.375rem; /* 6px */
    background-color: rgb(255 255 255);
    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
    padding-left: 1rem; /* 16px */
    padding-right: 1rem; /* 16px */
    padding-top: 0.5rem; /* 8px */
    padding-bottom: 0.5rem; /* 8px */
`;