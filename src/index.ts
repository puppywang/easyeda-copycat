/**
 * 入口文件
 *
 * 本文件为默认扩展入口文件，如果你想要配置其它文件作为入口文件，
 * 请修改 `extension.json` 中的 `entry` 字段；
 *
 * 请在此处使用 `export`  导出所有你希望在 `headerMenus` 中引用的方法，
 * 方法通过方法名与 `headerMenus` 关联。
 *
 * 如需了解更多开发细节，请阅读：
 * https://prodocs.lceda.cn/cn/api/guide/
 */
import * as extensionConfig from '../extension.json';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function activate(status?: 'onStartupFinished', arg?: string): void {}

export function about(): void {
	eda.sys_Dialog.showInformationMessage(eda.sys_I18n.text('Copycat v', undefined, undefined, extensionConfig.version), eda.sys_I18n.text('About'));
}

export async function save_comp_position(): Promise<void> {
	let componentsInfo: Record<
		string,
		{
			x: number;
			y: number;
			layer: number;
			rotation: number;
			name: string;
			pads: Array<{
				net: string;
				padNumber: string;
			}>;
		}
	> = {};
	const allTopComponents = await eda.pcb_PrimitiveComponent.getAll(EPCB_LayerId.TOP, false);
	const allBottomComponents = await eda.pcb_PrimitiveComponent.getAll(EPCB_LayerId.BOTTOM, false);
	for (const component of [...allTopComponents, ...allBottomComponents]) {
		const designator = component.getState_Designator();
		if (designator) {
			const allCompPins = await component.getAllPins();
			let pads: Array<{
				net: string;
				padNumber: string;
			}> = [];
			for (const pin of allCompPins) {
				const net = pin.getState_Net();
				pads.push({
					net: net ? net : '',
					padNumber: pin.getState_PadNumber(),
				});
			}
			componentsInfo[designator] = {
				x: component.getState_X(),
				y: component.getState_Y(),
				layer: component.getState_Layer(),
				rotation: component.getState_Rotation(),
				name: component.getState_Name() || '',
				pads: pads || [],
			};
		}
	}

	const componentsInfoBlob = new Blob([JSON.stringify(componentsInfo)], { type: 'application/json' });
	const pcbInfo = await eda.dmt_Pcb.getCurrentPcbInfo();
	const pcbName = pcbInfo ? pcbInfo.name + '_' : '';
	const fileName = `${pcbName}componentsInfo.json`;
	await eda.sys_FileSystem.saveFile(componentsInfoBlob, fileName);
	eda.sys_Dialog.showInformationMessage(eda.sys_I18n.text(`Components position saved to ${fileName}`), eda.sys_I18n.text('Save'));
}

export async function verify_comp_position(): Promise<void> {
	const file = await eda.sys_FileSystem.openReadFileDialog('.json');
	if (!file) {
		eda.sys_Dialog.showInformationMessage(eda.sys_I18n.text('No file selected'), eda.sys_I18n.text('Error'));
		return;
	}

	const fileContent = await file.text();
	let componentsInfo: Record<
		string,
		{
			x: number;
			y: number;
			layer: number;
			rotation: number;
			name: string;
			pads: Array<{
				net: string;
				padNumber: string;
			}>;
		}
	>;
	try {
		componentsInfo = JSON.parse(fileContent);
	} catch (error) {
		eda.sys_Dialog.showInformationMessage(eda.sys_I18n.text('Invalid JSON file'), eda.sys_I18n.text('Error'));
		return;
	}

	const allTopComponents = await eda.pcb_PrimitiveComponent.getAll(EPCB_LayerId.TOP, false);
	const allBottomComponents = await eda.pcb_PrimitiveComponent.getAll(EPCB_LayerId.BOTTOM, false);
	let mismatchCount = 0;
	let notFoundCount = 0;
	let messages: string[] = [];

	for (const [designator, info] of Object.entries(componentsInfo)) {
		const targetComponent = [...allTopComponents, ...allBottomComponents].find((comp) => comp.getState_Designator() === designator);
		if (targetComponent) {
			const x = targetComponent.getState_X();
			const y = targetComponent.getState_Y();
			const layer = targetComponent.getState_Layer();
			const rotation = targetComponent.getState_Rotation();
			if (x !== info.x || y !== info.y || layer !== info.layer || (rotation + 360) % 360 !== (info.rotation + 360) % 360) {
				const msg = `Component ${designator} position mismatch! Expected (${info.x}, ${info.y}) on layer ${info.layer} with rotation ${info.rotation}, but found (${x}, ${y}) on layer ${layer} with rotation ${rotation}`;
				messages.push(msg);
				console.log(msg);
				mismatchCount++;
			} else {
				console.log(`Component ${designator} position matches!`);
				notFoundCount++;
			}
			// Check pads if necessary: iterate through saved pads, find corresponding pad by primitiveId and compare its net
			const savedPads = info.pads || [];
			const targetPads = await targetComponent.getAllPins();
			const currentPadsMapping = new Map<string, IPCB_PrimitiveComponentPad>();
			for (const pad of targetPads) {
				currentPadsMapping.set(pad.getState_PadNumber(), pad);
			}
			console.log(`Verifying ${savedPads.length} pads for component ${designator}`);
			for (const savedPad of savedPads) {
				const currentPad = currentPadsMapping.get(savedPad.padNumber);
				if (currentPad) {
					const currentNet = currentPad.getState_Net();
					if (currentNet !== savedPad.net) {
						const msg = `Pad ${savedPad.padNumber} net mismatch for component ${designator}! Expected ${savedPad.net}, but found ${currentNet}`;
						messages.push(msg);
						console.log(msg);
					} else {
						console.log(`Pad ${savedPad.padNumber} net matches for component ${designator}`);
					}
				} else {
					const msg = `Pad ${savedPad.padNumber} not found for component ${designator}`;
					messages.push(msg);
					console.log(msg);
				}
			}
		} else {
			console.log(`Component ${designator} not found!`);
			notFoundCount++;
		}
	}

	eda.sys_Dialog.showInformationMessage(
		eda.sys_I18n.text(`Components verified: ${mismatchCount} placed, ${notFoundCount} not found\n${messages.join('\n')}`),
		eda.sys_I18n.text('Verify Stats'),
	);
}

export async function restore_comp_position(): Promise<void> {
	const file = await eda.sys_FileSystem.openReadFileDialog('.json');
	if (!file) {
		eda.sys_Dialog.showInformationMessage(eda.sys_I18n.text('No file selected'), eda.sys_I18n.text('Error'));
		return;
	}

	const fileContent = await file.text();
	let componentsInfo: Record<
		string,
		{
			x: number;
			y: number;
			layer: number;
			rotation: number;
			name: string;
			pads: Array<{
				net: string;
				padNumber: string;
			}>;
		}
	>;
	try {
		componentsInfo = JSON.parse(fileContent);
	} catch (error) {
		eda.sys_Dialog.showInformationMessage(eda.sys_I18n.text('Invalid JSON file'), eda.sys_I18n.text('Error'));
		return;
	}

	// Build the component mapping once for efficiency
	const topComponents = await eda.pcb_PrimitiveComponent.getAll(EPCB_LayerId.TOP, false);
	const bottomComponents = await eda.pcb_PrimitiveComponent.getAll(EPCB_LayerId.BOTTOM, false);
	const componentMapping: Record<string, IPCB_PrimitiveComponent> = {};
	for (const comp of [...topComponents, ...bottomComponents]) {
		const d = comp.getState_Designator();
		if (d) {
			componentMapping[d] = comp;
		}
	}

	let placedCount = 0;
	let notFoundCount = 0;
	let messages: string[] = [];

	for (const [designator, info] of Object.entries(componentsInfo)) {
		const targetComponent = componentMapping[designator];
		if (targetComponent) {
			// Compare first.
			const x = targetComponent.getState_X();
			const y = targetComponent.getState_Y();
			const layer = targetComponent.getState_Layer();
			const rotation = targetComponent.getState_Rotation();
			if (x !== info.x || y !== info.y || layer !== info.layer || (rotation + 360) % 360 !== (info.rotation + 360) % 360) {
				targetComponent.setState_X(info.x);
				targetComponent.setState_Y(info.y);
				targetComponent.setState_Rotation(info.rotation);
				// Assuming layer change is supported
				targetComponent.setState_Layer(info.layer);
				const msg = `Restoring component ${designator} to position (${info.x}, ${info.y}) on layer ${info.layer} with rotation ${info.rotation}`;
				messages.push(msg);
				console.log(msg);
				await targetComponent.done();
				placedCount++;
			}
			// Update pads if necessary: iterate through saved pads, find corresponding pad by primitiveId and update its net if needed
			const savedPads = info.pads || [];
			if (savedPads.length > 0) {
				const targetPads = await targetComponent.getAllPins();
				const currentPadsMapping = new Map<string, IPCB_PrimitiveComponentPad>();
				for (const pad of targetPads) {
					currentPadsMapping.set(pad.getState_PadNumber(), pad);
				}
				for (const savedPad of savedPads) {
					const currentPad = currentPadsMapping.get(savedPad.padNumber);
					if (currentPad && currentPad.getState_Net() !== savedPad.net) {
						const msg = `Updating pad ${savedPad.padNumber} net for component ${designator} from ${currentPad.getState_Net()} to ${savedPad.net}`;
						currentPad.setState_Net(savedPad.net);
						messages.push(msg);
						console.log(msg);
						await currentPad.done();
					}
				}
			}
		} else {
			notFoundCount++;
		}
	}

	eda.sys_Dialog.showInformationMessage(
		eda.sys_I18n.text(`Components restored: ${placedCount} placed, ${notFoundCount} not found\n${messages.join('\n')}`),
		eda.sys_I18n.text('Restore Stats'),
	);
}
