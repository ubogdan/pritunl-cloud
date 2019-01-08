/// <reference path="../References.d.ts"/>
export const SYNC = 'disk.sync';
export const TRAVERSE = 'disk.traverse';
export const FILTER = 'disk.filter';
export const CHANGE = 'disk.change';

export interface Disk {
	id?: string;
	name?: string;
	node?: string;
	organization?: string;
	state?: string;
	instance?: string;
	delete_protection?: boolean;
	image?: string;
	backing?: boolean;
	backing_image?: string;
	index?: string;
	size?: number;
}

export interface Filter {
	id?: string;
	name?: string;
	organization?: string;
	datacenter?: string;
	instance?: string;
}

export type Disks = Disk[];

export type DiskRo = Readonly<Disk>;
export type DisksRo = ReadonlyArray<DiskRo>;

export interface DiskDispatch {
	type: string;
	data?: {
		id?: string;
		disk?: Disk;
		disks?: Disks;
		page?: number;
		pageCount?: number;
		filter?: Filter;
		count?: number;
	};
}
