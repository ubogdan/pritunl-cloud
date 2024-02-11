/// <reference path="../References.d.ts"/>
import * as React from 'react';
import * as Constants from '../Constants';
import * as PoolTypes from '../types/PoolTypes';
import SearchInput from './SearchInput';
import * as OrganizationTypes from "../types/OrganizationTypes";

interface Props {
	filter: PoolTypes.Filter;
	onFilter: (filter: PoolTypes.Filter) => void;
}

const css = {
	filters: {
		margin: '-15px 0 5px 0',
	} as React.CSSProperties,
	input: {
		width: '200px',
		margin: '5px',
	} as React.CSSProperties,
	shortInput: {
		width: '180px',
		margin: '5px',
	} as React.CSSProperties,
	role: {
		width: '150px',
		margin: '5px',
	} as React.CSSProperties,
	type: {
		margin: '5px',
	} as React.CSSProperties,
	check: {
		margin: '12px 5px 8px 5px',
	} as React.CSSProperties,
};

export default class PoolsFilter extends React.Component<Props, {}> {
	constructor(props: any, context: any) {
		super(props, context);
		this.state = {
			menu: false,
		};
	}

	render(): JSX.Element {
		if (this.props.filter === null) {
			return <div/>;
		}

		return <div className="layout horizontal wrap" style={css.filters}>
			<SearchInput
				style={css.input}
				placeholder="Pool ID"
				value={this.props.filter.id}
				onChange={(val: string): void => {
					let filter = {
						...this.props.filter,
					};

					if (val) {
						filter.id = val;
					} else {
						delete filter.id;
					}

					this.props.onFilter(filter);
				}}
			/>
			<SearchInput
				style={css.input}
				placeholder="Name"
				value={this.props.filter.name}
				onChange={(val: string): void => {
					let filter = {
						...this.props.filter,
					};

					if (val) {
						filter.name = val;
					} else {
						delete filter.name;
					}

					this.props.onFilter(filter);
				}}
			/>
			<SearchInput
				style={css.shortInput}
				placeholder="Comment"
				value={this.props.filter.comment}
				onChange={(val: string): void => {
					let filter = {
						...this.props.filter,
					};

					if (val) {
						filter.comment = val;
					} else {
						delete filter.comment;
					}

					this.props.onFilter(filter);
				}}
			/>
			<SearchInput
				style={css.input}
				placeholder="Volume Group Name"
				value={this.props.filter.vg_name}
				onChange={(val: string): void => {
					let filter = {
						...this.props.filter,
					};

					if (val) {
						filter.vg_name = val;
					} else {
						delete filter.vg_name;
					}

					this.props.onFilter(filter);
				}}
			/>
		</div>;
	}
}
