import { INeoFlowNode } from '@neo-edge-web/models';

const color = {
  Tag: '#3bcbeb',
  Static: '#1d50a2',
  Attribute: '#ff9f5a'
};

export const connectNode = ({
  source,
  target
}: {
  source: INeoFlowNode;
  target: INeoFlowNode;
  appendRemove: boolean;
}) => {
  const dataClass = source?.id?.split('/')[1] ?? 'Tag';
  const line = new LeaderLine(document.getElementById(source.id), document.getElementById(target.id), {
    startPlug: 'disc',
    endPlug: 'disc',
    color: color[dataClass],
    size: 2
  });

  return line;
};

export const appendRemoveBtn = (line, startNode, endNode, delFn?) => {
  if (line && startNode && endNode) {
    const removeButton = document.body.appendChild(document.createElement('div'));
    const rect = document.getElementById(endNode.id).getBoundingClientRect();
    removeButton.className = 'remove-neoflow-line-btn';
    removeButton.title = 'Remove Line';
    removeButton.style.left = `${rect.right - 64}px`;
    removeButton.style.top = `${rect.top + rect.height / 2 - 10}px`;
    removeButton.style.display = 'none';
    removeButton.setAttribute('data-line-start', startNode.id);
    removeButton.setAttribute('data-line-end', endNode.id);

    removeButton.addEventListener('click', () => {
      if (delFn) {
        delFn(line);
      }
      // document.body.removeChild(removeButton);
    });
  }
};
