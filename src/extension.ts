// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "inknote" is now active!');

	let disposable = vscode.commands.registerCommand('inknote.createDailyNote', () => {

		const config = vscode.workspace.getConfiguration('inknote')
		const rootPath = (config.get('rootPath') as string || undefined) || vscode.workspace.rootPath;
		const folderName = config.get('dailyNoteFolderName') as string || undefined;
		const fileNames = config.get('dailyNoteFileNames') as string[] || undefined;

		if (rootPath == undefined) {
			vscode.window.showErrorMessage("Root path not found");
			return;
		}
		if (folderName == undefined) {
			vscode.window.showErrorMessage("Folder name not found");
			return;
		}
		if (fileNames == undefined) {
			vscode.window.showErrorMessage("File names not found");
			return;
		}

		if (vscode.workspace.workspaceFolders == undefined) {
			vscode.window.showErrorMessage("Workspace folders not found");
			return;
		}

		const currentDate = new Date()
		const year = currentDate.getFullYear().toString().substring(2)
		const month = currentDate.getMonth() + 1
		const day = currentDate.getDate()
		const datePath = [year, month, day].join('/')

		const wsFolderPaths = vscode.workspace.workspaceFolders.map(v => v.uri.path);

		vscode.window.showQuickPick(wsFolderPaths, {canPickMany: false}).then(value => {
			if (!value) return;
			const wsPath = vscode.Uri.joinPath(vscode.Uri.parse(value), folderName, datePath).path;

			vscode.window.showInputBox({prompt: "Destination path", value: wsPath}).then(value => {
				if (!value) return;

				const dirUri = vscode.Uri.parse(value)
				const wsedit = new vscode.WorkspaceEdit();
				fileNames.forEach(fileName => {
					const filePath = vscode.Uri.joinPath(dirUri, fileName);
					wsedit.createFile(filePath, { ignoreIfExists: true });
				})
				vscode.workspace.applyEdit(wsedit);
				vscode.window.showInformationMessage('Created a new daily directory');
			});
		})


	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
