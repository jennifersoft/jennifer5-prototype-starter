import * as monaco from "monaco-editor";

function createItem(range, label, detail="") {
    return {
        label: label,
        kind: monaco.languages.CompletionItemKind.Folder,
        insertText: label.toUpperCase(),
        range: range,
        detail: detail
    };
}

export const addCompletionItems = function(regex, items) {
    monaco.languages.registerCompletionItemProvider('sql', {
        provideCompletionItems: (model, position) => {
            const textUntilPosition = model.getValueInRange({
                startLineNumber: position.lineNumber,
                endLineNumber: position.lineNumber,
                startColumn: 1,
                endColumn: position.column
            });
            const match = textUntilPosition.match(regex);
            if (!match) return { suggestions: [] };

            const word = model.getWordUntilPosition(position);
            const range = {
                startLineNumber: position.lineNumber,
                endLineNumber: position.lineNumber,
                startColumn: word.startColumn,
                endColumn: word.endColumn
            };

            return {
                suggestions: items.map(item => createItem(range, item[0], item[1]))
            }
        }
    });
}

