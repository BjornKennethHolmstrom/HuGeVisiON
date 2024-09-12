import { scene } from './core.js';
import { nodes } from './nodeManager.js';
import { getColorForConnectionType } from './utils.js';
import { MAX_CONNECTIONS } from './config.js';
import * as THREE from './lib/three.module.js';
import { triggerSync } from './dataSync.js';

export let lines = {};
export let loadedConnections = new Set();

export function initConnectionManager() {
    // ... (existing connection-related initialization)
}

export function addConnection(connection, addToScene = true) {
    const startNode = nodes[connection.from_node_id];
    const endNode = nodes[connection.to_node_id];

    if (!startNode || !endNode) {
        return null;
    }

    const start = startNode.position;
    const end = endNode.position;

    const points = [];
    points.push(new THREE.Vector3(start.x, start.y, start.z));
    points.push(new THREE.Vector3(end.x, end.y, end.z));

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
        color: getColorForConnectionType(connection.type),
        linewidth: 3, // Increased from default 1
        opacity: 0.8,
        transparent: true
    });
    const line = new THREE.Line(geometry, material);
    line.userData = connection;
    
    if (addToScene) {
        scene.add(line);
    }
    lines[connection.id] = line;
    loadedConnections.add(connection.id);
    triggerSync();
    return line;
}

export function addConnectionToScene(connectionId) {
    if (lines[connectionId] && !scene.getObjectById(lines[connectionId].id)) {
        scene.add(lines[connectionId]);
    }
}

export function clearConnections() {
    Object.values(lines).forEach(line => {
        scene.remove(line);
    });
    lines = {};
    loadedConnections.clear();
}
