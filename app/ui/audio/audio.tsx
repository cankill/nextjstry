const context = new AudioContext();
const nodes = new Map();

const osc1 = context.createOscillator();
osc1.frequency.value = 220;
osc1.type = 'square';
osc1.start();

const osc2 = context.createOscillator();
osc2.frequency.value = 20;
osc2.type = 'sine';
osc2.start();

const amp1 = context.createGain();
amp1.gain.value = 0.5;

const amp2 = context.createGain();
amp2.gain.value = 0.89;

const out = context.destination;

nodes.set('1', osc1)
nodes.set('2', osc2)
nodes.set('3', amp1)
nodes.set('4', amp2)
nodes.set('5', out)

export function updateAudioNode(id: string, data: Object) {
    const node = nodes.get(id);

    for (const [key, value] of Object.entries(data)) {
        if(node[key] instanceof AudioParam) {
            node[key].value = value;
        } else {
            node[key] = value
        }        
    }
}

export function removeAudionNode(id: string) {
    const node = nodes.get(id);

    node.disconnect();
    node.stop?.();

    nodes.delete(id);
}

export function connectNodes(sourceId: string|null, targetId: string|null) {
    const source = nodes.get(sourceId);
    const target = nodes.get(targetId);

    source.connect(target);
}

export function disconnectNodes(sourceId: string|null, targetId: string|null) {
    const source = nodes.get(sourceId);
    const target = nodes.get(targetId);

    source.disconnect(target);
}

export function isRunning() {
    return context.state === 'running';
}

export function toggleAudio(): Promise<void> {
    return isRunning() ? context.suspend() : context.resume();
}