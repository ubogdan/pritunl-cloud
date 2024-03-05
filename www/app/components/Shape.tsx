/// <reference path="../References.d.ts"/>
import * as React from 'react';
import * as MiscUtils from '../utils/MiscUtils';
import * as ShapeTypes from '../types/ShapeTypes';
import * as DatacenterTypes from '../types/DatacenterTypes';
import * as ZoneTypes from '../types/ZoneTypes';
import ShapeDetailed from './ShapeDetailed';
import ZonesStore from "../stores/ZonesStore";
import * as PoolTypes from "../types/PoolTypes";

interface Props {
	datacenters: DatacenterTypes.DatacentersRo;
	zones: ZoneTypes.ZonesRo;
	pools: PoolTypes.PoolsRo;
	shape: ShapeTypes.ShapeRo;
	selected: boolean;
	onSelect: (shift: boolean) => void;
	open: boolean;
	onOpen: () => void;
}

const css = {
	card: {
		display: 'table-row',
		width: '100%',
		padding: 0,
		boxShadow: 'none',
		cursor: 'pointer',
	} as React.CSSProperties,
	cardOpen: {
		display: 'table-row',
		width: '100%',
		padding: 0,
		boxShadow: 'none',
		position: 'relative',
	} as React.CSSProperties,
	select: {
		margin: '2px 0 0 0',
		paddingTop: '3px',
		minHeight: '18px',
	} as React.CSSProperties,
	name: {
		verticalAlign: 'top',
		display: 'table-cell',
		padding: '8px',
	} as React.CSSProperties,
	nameSpan: {
		margin: '1px 5px 0 0',
	} as React.CSSProperties,
	item: {
		verticalAlign: 'top',
		display: 'table-cell',
		padding: '9px',
		whiteSpace: 'nowrap',
	} as React.CSSProperties,
	icon: {
		marginRight: '3px',
	} as React.CSSProperties,
	bars: {
		verticalAlign: 'top',
		display: 'table-cell',
		padding: '8px',
		width: '30px',
	} as React.CSSProperties,
	bar: {
		height: '6px',
		marginBottom: '1px',
	} as React.CSSProperties,
	barLast: {
		height: '6px',
	} as React.CSSProperties,
	roles: {
		verticalAlign: 'top',
		display: 'table-cell',
		padding: '0 8px 8px 8px',
	} as React.CSSProperties,
	tag: {
		margin: '8px 5px 0 5px',
		height: '20px',
	} as React.CSSProperties,
};

export default class Shape extends React.Component<Props, {}> {
	render(): JSX.Element {
		let shape = this.props.shape;

		if (this.props.open) {
			return <div
				className="bp3-card bp3-row"
				style={css.cardOpen}
			>
				<ShapeDetailed
					datacenters={this.props.datacenters}
					zones={this.props.zones}
					pools={this.props.pools}
					shape={this.props.shape}
					selected={this.props.selected}
					onSelect={this.props.onSelect}
					onClose={(): void => {
						this.props.onOpen();
					}}
				/>
			</div>;
		}

		let cardStyle = {
			...css.card,
		};

		let zone = ZonesStore.zone(this.props.shape.zone);
		let zoneName = zone ? zone.name : null;

		return <div
			className="bp3-card bp3-row"
			style={cardStyle}
			onClick={(evt): void => {
				let target = evt.target as HTMLElement;

				if (target.className.indexOf('open-ignore') !== -1) {
					return;
				}

				this.props.onOpen();
			}}
		>
			<div className="bp3-cell" style={css.name}>
				<div className="layout horizontal">
					<label
						className="bp3-control bp3-checkbox open-ignore"
						style={css.select}
					>
						<input
							type="checkbox"
							className="open-ignore"
							checked={this.props.selected}
							onChange={(evt): void => {
							}}
							onClick={(evt): void => {
								this.props.onSelect(evt.shiftKey);
							}}
						/>
						<span className="bp3-control-indicator open-ignore"/>
					</label>
					<div style={css.nameSpan}>
						{shape.name}
					</div>
				</div>
			</div>
			<div className="bp3-cell" style={css.item}>
				<span
					style={css.icon}
					hidden={!zoneName}
					className="bp3-icon-standard bp3-text-muted bp3-icon-layout-circle"
				/>
				{zoneName}
			</div>
		</div>;
	}
}
