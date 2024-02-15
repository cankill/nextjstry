import { Edge, Node, OnConnect, OnEdgesChange, OnEdgesDelete, OnNodesChange, OnNodesDelete, addEdge, applyEdgeChanges, applyNodeChanges } from "reactflow";
import { create } from "zustand";

import initialNodes from './nodes';
import initialEdges from './edges';
import { connectNodes, disconnectNodes, isRunning, removeAudionNode, toggleAudio, updateAudioNode } from "../audio/audio";

export interface OutData {
}

export interface OscData {
    frequency?: number,
    type?: string,
}

export interface GainData {
    gain?: number,
}

export interface NodesState {
    nodes: Node[],
    edges: Edge[],
    isRunning: Boolean,
    onNodesChange: OnNodesChange,
    onEdgesChange: OnEdgesChange,
    onEdgesDelete: OnEdgesDelete,
    onConnect: OnConnect,
    updateNode: (id: string, data: Object) => void,
    toggleAudio: () => void,
    onNodesDelete: OnNodesDelete,
}

const useStore = create<NodesState>()((set, get) => ({
    nodes: initialNodes,
    edges: initialEdges,
    isRunning: false,
    onNodesChange: (changes) => set((state) => ({ nodes: applyNodeChanges(changes, get().nodes)})),
    onEdgesChange: (changes) => set({ edges: applyEdgeChanges(changes, get().edges)}),
    onEdgesDelete: (deletions) => {
        for ( const { source, target } of deletions) {
            disconnectNodes(source, target)
        }
    },
    onConnect: (connection) => {
        connectNodes(connection.source, connection.target);
        set({ edges: addEdge(connection, get().edges)});
    },
    updateNode: (id: string, data: GainData|OscData|OutData) => {
        updateAudioNode(id, data)
        set({ nodes:
            get().nodes.map(node => 
                node.id === id
                ? { ...node, data: { ...node.data, ...data}}    
                : node
        )});
    },
    toggleAudio: () => {
        toggleAudio().then(() => {
            set({ isRunning: isRunning() });
        })
    },
    onNodesDelete: (nodes: Node[]) => {
        for (const { id } of nodes) {
            removeAudionNode(id)
        }
    },
}));

export default useStore;