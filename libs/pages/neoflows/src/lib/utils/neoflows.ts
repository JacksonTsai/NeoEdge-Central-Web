import { INeoFlowNode } from '@neo-edge-web/models';

export const isExistConnection = (source: INeoFlowNode, target: INeoFlowNode, curConnection: LeaderLine[]) => {
  return curConnection.findIndex((conn: any) => conn.start.id === source.id && conn.end.id === target.id) > -1
    ? true
    : false;
};

export const inputSocketConnection = (target: INeoFlowNode, curConnection: LeaderLine[]): LeaderLine => {
  return curConnection.find((conn: any) => conn.end.id === target.id);
};

export const outputSocketConnection = (source: INeoFlowNode, curConnection: LeaderLine[]): LeaderLine => {
  return curConnection.find((conn: any) => conn.start.id === source.id);
};

export const delConnectLine = (deleteLine: LeaderLine): void => {
  const lines: any = document.querySelectorAll('.leader-line');
  lines?.forEach((line) => {
    const sourceId = (deleteLine.start as Element).id;
    const targetId = (deleteLine.end as Element).id;
    line.dataset['lineStart'] === sourceId && line.dataset['lineEnd'] === targetId ? line.remove() : null;
  });
};

export const showRemoveBtn = (source: INeoFlowNode, connection: LeaderLine[], delFn: (v) => void): void => {
  delAllRemoveBtn();
  connection?.forEach((conn) => {
    const connStartId = (conn.start as Element).id;
    const connEndId = (conn.end as Element).id;
    if (source.id == connStartId) {
      const removeButton = document.body.appendChild(document.createElement('div'));
      const rect = document.getElementById(connEndId).getBoundingClientRect();
      removeButton.className = 'remove-neoflow-line-btn';
      removeButton.title = 'Remove Line';
      removeButton.style.left = `${rect.right - 64}px`;
      removeButton.style.top = `${rect.top + rect.height / 2 - 10}px`;
      removeButton.style.display = 'block';
      removeButton.setAttribute('data-line-start', connStartId);
      removeButton.setAttribute('data-line-end', connEndId);
      const elmWrapper = document.getElementById('processor-wrapper');
      elmWrapper.appendChild(removeButton);

      removeButton.addEventListener('click', () => {
        if (delFn) {
          delFn(conn);
        }
      });
    }
  });
};

export const delAllRemoveBtn = (): void => {
  const removeBtn: any = document.querySelectorAll(`.remove-neoflow-line-btn`);
  removeBtn.forEach((rBtn) => {
    rBtn.remove();
  });
};

export const delRemoveBtnByLine = (deleteLine: LeaderLine): void => {
  const removeBtn: any = document.querySelectorAll('.remove-neoflow-line-btn');
  removeBtn?.forEach((rBtn) => {
    const sourceId = (deleteLine.start as Element).id;
    const targetId = (deleteLine.end as Element).id;
    rBtn.dataset['lineStart'] === sourceId && rBtn.dataset['lineEnd'] === targetId ? rBtn.remove() : null;
  });
};
