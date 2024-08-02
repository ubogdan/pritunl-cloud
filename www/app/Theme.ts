/// <reference path="./References.d.ts"/>
import * as SuperAgent from 'superagent';
import * as Alert from './Alert';
import * as Csrf from './Csrf';
import * as Monaco from "monaco-editor"
import loader from "@monaco-editor/loader"

export interface Callback {
	(): void;
}

let callbacks: Set<Callback> = new Set<Callback>();
export let theme = 'dark';

export function save(): Promise<void> {
	return new Promise<void>((resolve, reject): void => {
		SuperAgent
			.put('/theme')
			.send({
				theme: theme,
			})
			.set('Accept', 'application/json')
			.set('Csrf-Token', Csrf.token)
			.end((err: any, res: SuperAgent.Response): void => {
				if (res && res.status === 401) {
					window.location.href = '/login';
					resolve();
					return;
				}

				if (err) {
					Alert.errorRes(res, 'Failed to save theme');
					reject(err);
					return;
				}

				resolve();
			});
	});
}

export function light(): void {
	theme = 'light';
	document.body.className = '';
	callbacks.forEach((callback: Callback): void => {
		callback();
	});
}

export function dark(): void {
	theme = 'dark';
	document.body.className = 'bp5-dark';
	callbacks.forEach((callback: Callback): void => {
		callback();
	});
}

export function toggle(): void {
	if (theme === 'light') {
		dark();
	} else {
		light();
	}
}

export function editorTheme(): string {
	if (theme === "light") {
		return "tomorrow";
	} else {
		return "tomorrow-night"; // tomorrow-night, nord, night-owl
	}
}

export function addChangeListener(callback: Callback): void {
	callbacks.add(callback);
}

export function removeChangeListener(callback: () => void): void {
	callbacks.delete(callback);
}

let allHallowsEve = {
	"base": "vs-dark",
	"inherit": true,
	"rules": [
		{
			"background": "000000",
			"token": ""
		},
		{
			"foreground": "ffffff",
			"background": "434242",
			"token": "text"
		},
		{
			"foreground": "ffffff",
			"background": "000000",
			"token": "source"
		},
		{
			"foreground": "9933cc",
			"token": "comment"
		},
		{
			"foreground": "3387cc",
			"token": "constant"
		},
		{
			"foreground": "cc7833",
			"token": "keyword"
		},
		{
			"foreground": "d0d0ff",
			"token": "meta.preprocessor.c"
		},
		{
			"fontStyle": "italic",
			"token": "variable.parameter"
		},
		{
			"foreground": "ffffff",
			"background": "9b9b9b",
			"token": "source comment.block"
		},
		{
			"foreground": "66cc33",
			"token": "string"
		},
		{
			"foreground": "aaaaaa",
			"token": "string constant.character.escape"
		},
		{
			"foreground": "000000",
			"background": "cccc33",
			"token": "string.interpolated"
		},
		{
			"foreground": "cccc33",
			"token": "string.regexp"
		},
		{
			"foreground": "cccc33",
			"token": "string.literal"
		},
		{
			"foreground": "555555",
			"token": "string.interpolated constant.character.escape"
		},
		{
			"fontStyle": "underline",
			"token": "entity.name.type"
		},
		{
			"fontStyle": "italic underline",
			"token": "entity.other.inherited-class"
		},
		{
			"fontStyle": "underline",
			"token": "entity.name.tag"
		},
		{
			"foreground": "c83730",
			"token": "support.function"
		}
	],
	"colors": {
		"editor.foreground": "#FFFFFF",
		"editor.background": "#000000",
		"editor.selectionBackground": "#73597EE0",
		"editor.lineHighlightBackground": "#333300",
		"editorCursor.foreground": "#FFFFFF",
		"editorWhitespace.foreground": "#404040"
	}
} as Monaco.editor.IStandaloneThemeData

let amy = {
	"base": "vs-dark",
	"inherit": true,
	"rules": [
		{
			"background": "200020",
			"token": ""
		},
		{
			"foreground": "404080",
			"background": "200020",
			"fontStyle": "italic",
			"token": "comment.block"
		},
		{
			"foreground": "999999",
			"token": "string"
		},
		{
			"foreground": "707090",
			"token": "constant.language"
		},
		{
			"foreground": "7090b0",
			"token": "constant.numeric"
		},
		{
			"fontStyle": "bold",
			"token": "constant.numeric.integer.int32"
		},
		{
			"fontStyle": "italic",
			"token": "constant.numeric.integer.int64"
		},
		{
			"fontStyle": "bold italic",
			"token": "constant.numeric.integer.nativeint"
		},
		{
			"fontStyle": "underline",
			"token": "constant.numeric.floating-point.ocaml"
		},
		{
			"foreground": "666666",
			"token": "constant.character"
		},
		{
			"foreground": "8080a0",
			"token": "constant.language.boolean"
		},
		{
			"foreground": "008080",
			"token": "variable.language"
		},
		{
			"foreground": "008080",
			"token": "variable.other"
		},
		{
			"foreground": "a080ff",
			"token": "keyword"
		},
		{
			"foreground": "a0a0ff",
			"token": "keyword.operator"
		},
		{
			"foreground": "d0d0ff",
			"token": "keyword.other.decorator"
		},
		{
			"fontStyle": "underline",
			"token": "keyword.operator.infix.floating-point.ocaml"
		},
		{
			"fontStyle": "underline",
			"token": "keyword.operator.prefix.floating-point.ocaml"
		},
		{
			"foreground": "c080c0",
			"token": "keyword.other.directive"
		},
		{
			"foreground": "c080c0",
			"fontStyle": "underline",
			"token": "keyword.other.directive.line-number"
		},
		{
			"foreground": "80a0ff",
			"token": "keyword.control"
		},
		{
			"foreground": "b0fff0",
			"token": "storage"
		},
		{
			"foreground": "60b0ff",
			"token": "entity.name.type.variant"
		},
		{
			"foreground": "60b0ff",
			"fontStyle": "italic",
			"token": "storage.type.variant.polymorphic"
		},
		{
			"foreground": "60b0ff",
			"fontStyle": "italic",
			"token": "entity.name.type.variant.polymorphic"
		},
		{
			"foreground": "b000b0",
			"token": "entity.name.type.module"
		},
		{
			"foreground": "b000b0",
			"fontStyle": "underline",
			"token": "entity.name.type.module-type.ocaml"
		},
		{
			"foreground": "a00050",
			"token": "support.other"
		},
		{
			"foreground": "70e080",
			"token": "entity.name.type.class"
		},
		{
			"foreground": "70e0a0",
			"token": "entity.name.type.class-type"
		},
		{
			"foreground": "50a0a0",
			"token": "entity.name.function"
		},
		{
			"foreground": "80b0b0",
			"token": "variable.parameter"
		},
		{
			"foreground": "3080a0",
			"token": "entity.name.type.token"
		},
		{
			"foreground": "3cb0d0",
			"token": "entity.name.type.token.reference"
		},
		{
			"foreground": "90e0e0",
			"token": "entity.name.function.non-terminal"
		},
		{
			"foreground": "c0f0f0",
			"token": "entity.name.function.non-terminal.reference"
		},
		{
			"foreground": "009090",
			"token": "entity.name.tag"
		},
		{
			"background": "200020",
			"token": "support.constant"
		},
		{
			"foreground": "400080",
			"background": "ffff00",
			"fontStyle": "bold",
			"token": "invalid.illegal"
		},
		{
			"foreground": "200020",
			"background": "cc66ff",
			"token": "invalid.deprecated"
		},
		{
			"background": "40008054",
			"token": "source.camlp4.embedded"
		},
		{
			"foreground": "805080",
			"token": "punctuation"
		}
	],
	"colors": {
		"editor.foreground": "#D0D0FF",
		"editor.background": "#200020",
		"editor.selectionBackground": "#80000080",
		"editor.lineHighlightBackground": "#80000040",
		"editorCursor.foreground": "#7070FF",
		"editorWhitespace.foreground": "#BFBFBF"
	}
} as Monaco.editor.IStandaloneThemeData

let birdsOfParadise = {
	"base": "vs-dark",
	"inherit": true,
	"rules": [
		{
			"background": "372725",
			"token": ""
		},
		{
			"foreground": "e6e1c4",
			"background": "322323",
			"token": "source"
		},
		{
			"foreground": "6b4e32",
			"fontStyle": "italic",
			"token": "comment"
		},
		{
			"foreground": "ef5d32",
			"token": "keyword"
		},
		{
			"foreground": "ef5d32",
			"token": "storage"
		},
		{
			"foreground": "efac32",
			"token": "entity.name.function"
		},
		{
			"foreground": "efac32",
			"token": "keyword.other.name-of-parameter.objc"
		},
		{
			"foreground": "efac32",
			"fontStyle": "bold",
			"token": "entity.name"
		},
		{
			"foreground": "6c99bb",
			"token": "constant.numeric"
		},
		{
			"foreground": "7daf9c",
			"token": "variable.language"
		},
		{
			"foreground": "7daf9c",
			"token": "variable.other"
		},
		{
			"foreground": "6c99bb",
			"token": "constant"
		},
		{
			"foreground": "efac32",
			"token": "variable.other.constant"
		},
		{
			"foreground": "6c99bb",
			"token": "constant.language"
		},
		{
			"foreground": "d9d762",
			"token": "string"
		},
		{
			"foreground": "efac32",
			"token": "support.function"
		},
		{
			"foreground": "efac32",
			"token": "support.type"
		},
		{
			"foreground": "6c99bb",
			"token": "support.constant"
		},
		{
			"foreground": "efcb43",
			"token": "meta.tag"
		},
		{
			"foreground": "efcb43",
			"token": "declaration.tag"
		},
		{
			"foreground": "efcb43",
			"token": "entity.name.tag"
		},
		{
			"foreground": "efcb43",
			"token": "entity.other.attribute-name"
		},
		{
			"foreground": "ffffff",
			"background": "990000",
			"token": "invalid"
		},
		{
			"foreground": "7daf9c",
			"token": "constant.character.escaped"
		},
		{
			"foreground": "7daf9c",
			"token": "constant.character.escape"
		},
		{
			"foreground": "7daf9c",
			"token": "string source"
		},
		{
			"foreground": "7daf9c",
			"token": "string source.ruby"
		},
		{
			"foreground": "e6e1dc",
			"background": "144212",
			"token": "markup.inserted"
		},
		{
			"foreground": "e6e1dc",
			"background": "660000",
			"token": "markup.deleted"
		},
		{
			"background": "2f33ab",
			"token": "meta.diff.header"
		},
		{
			"background": "2f33ab",
			"token": "meta.separator.diff"
		},
		{
			"background": "2f33ab",
			"token": "meta.diff.index"
		},
		{
			"background": "2f33ab",
			"token": "meta.diff.range"
		}
	],
	"colors": {
		"editor.foreground": "#E6E1C4",
		"editor.background": "#372725",
		"editor.selectionBackground": "#16120E",
		"editor.lineHighlightBackground": "#1F1611",
		"editorCursor.foreground": "#E6E1C4",
		"editorWhitespace.foreground": "#42302D"
	}
} as Monaco.editor.IStandaloneThemeData

let blackboard = {
	"base": "vs-dark",
	"inherit": true,
	"rules": [
		{
			"background": "0C1021",
			"token": ""
		},
		{
			"foreground": "aeaeae",
			"token": "comment"
		},
		{
			"foreground": "d8fa3c",
			"token": "constant"
		},
		{
			"foreground": "ff6400",
			"token": "entity"
		},
		{
			"foreground": "fbde2d",
			"token": "keyword"
		},
		{
			"foreground": "fbde2d",
			"token": "storage"
		},
		{
			"foreground": "61ce3c",
			"token": "string"
		},
		{
			"foreground": "61ce3c",
			"token": "meta.verbatim"
		},
		{
			"foreground": "8da6ce",
			"token": "support"
		},
		{
			"foreground": "ab2a1d",
			"fontStyle": "italic",
			"token": "invalid.deprecated"
		},
		{
			"foreground": "f8f8f8",
			"background": "9d1e15",
			"token": "invalid.illegal"
		},
		{
			"foreground": "ff6400",
			"fontStyle": "italic",
			"token": "entity.other.inherited-class"
		},
		{
			"foreground": "ff6400",
			"token": "string constant.other.placeholder"
		},
		{
			"foreground": "becde6",
			"token": "meta.function-call.py"
		},
		{
			"foreground": "7f90aa",
			"token": "meta.tag"
		},
		{
			"foreground": "7f90aa",
			"token": "meta.tag entity"
		},
		{
			"foreground": "ffffff",
			"token": "entity.name.section"
		},
		{
			"foreground": "d5e0f3",
			"token": "keyword.type.variant"
		},
		{
			"foreground": "f8f8f8",
			"token": "source.ocaml keyword.operator.symbol"
		},
		{
			"foreground": "8da6ce",
			"token": "source.ocaml keyword.operator.symbol.infix"
		},
		{
			"foreground": "8da6ce",
			"token": "source.ocaml keyword.operator.symbol.prefix"
		},
		{
			"fontStyle": "underline",
			"token": "source.ocaml keyword.operator.symbol.infix.floating-point"
		},
		{
			"fontStyle": "underline",
			"token": "source.ocaml keyword.operator.symbol.prefix.floating-point"
		},
		{
			"fontStyle": "underline",
			"token": "source.ocaml constant.numeric.floating-point"
		},
		{
			"background": "ffffff08",
			"token": "text.tex.latex meta.function.environment"
		},
		{
			"background": "7a96fa08",
			"token": "text.tex.latex meta.function.environment meta.function.environment"
		},
		{
			"foreground": "fbde2d",
			"token": "text.tex.latex support.function"
		},
		{
			"foreground": "ffffff",
			"token": "source.plist string.unquoted"
		},
		{
			"foreground": "ffffff",
			"token": "source.plist keyword.operator"
		}
	],
	"colors": {
		"editor.foreground": "#F8F8F8",
		"editor.background": "#0C1021",
		"editor.selectionBackground": "#253B76",
		"editor.lineHighlightBackground": "#FFFFFF0F",
		"editorCursor.foreground": "#FFFFFFA6",
		"editorWhitespace.foreground": "#FFFFFF40"
	}
} as Monaco.editor.IStandaloneThemeData

let brillianceBlack = {
	"base": "vs-dark",
	"inherit": true,
	"rules": [
		{
			"background": "0D0D0DFA",
			"token": ""
		},
		{
			"foreground": "000000",
			"background": "ffffff",
			"fontStyle": "bold",
			"token": "meta.thomas_aylott"
		},
		{
			"foreground": "555555",
			"background": "ffffff",
			"fontStyle": "underline",
			"token": "meta.subtlegradient"
		},
		{
			"foreground": "fffc80",
			"background": "803d0033",
			"token": "string -meta.tag -meta.doctype -string.regexp -string.literal -string.interpolated -string.quoted.literal -string.unquoted"
		},
		{
			"foreground": "fffc80",
			"background": "803d0033",
			"token": "variable.parameter.misc.css"
		},
		{
			"foreground": "fffc80",
			"background": "803d0033",
			"token": "text string source string"
		},
		{
			"foreground": "fffc80",
			"background": "803d0033",
			"token": "string.unquoted string"
		},
		{
			"foreground": "fffc80",
			"background": "803d0033",
			"token": "string.regexp string"
		},
		{
			"foreground": "fffc80",
			"background": "803d0033",
			"token": "string.interpolated string"
		},
		{
			"foreground": "fffc80",
			"background": "803d0033",
			"token": "meta.tag source string"
		},
		{
			"foreground": "803d00",
			"token": "punctuation.definition.string -meta.tag"
		},
		{
			"foreground": "fff80033",
			"token": "string.regexp punctuation.definition.string"
		},
		{
			"foreground": "fff80033",
			"token": "string.quoted.literal punctuation.definition.string"
		},
		{
			"foreground": "fff80033",
			"token": "string.quoted.double.ruby.mod punctuation.definition.string"
		},
		{
			"foreground": "fff800",
			"background": "43800033",
			"token": "string.quoted.literal"
		},
		{
			"foreground": "fff800",
			"background": "43800033",
			"token": "string.quoted.double.ruby.mod"
		},
		{
			"foreground": "ffbc80",
			"token": "string.unquoted -string.unquoted.embedded"
		},
		{
			"foreground": "ffbc80",
			"token": "string.quoted.double.multiline"
		},
		{
			"foreground": "ffbc80",
			"token": "meta.scope.heredoc"
		},
		{
			"foreground": "fffc80",
			"background": "1a1a1a",
			"token": "string.interpolated"
		},
		{
			"foreground": "fff800",
			"background": "43800033",
			"token": "string.regexp"
		},
		{
			"background": "43800033",
			"token": "string.regexp.group"
		},
		{
			"foreground": "ffffff66",
			"background": "43800033",
			"token": "string.regexp.group string.regexp.group"
		},
		{
			"foreground": "ffffff66",
			"background": "43800033",
			"token": "string.regexp.group string.regexp.group string.regexp.group"
		},
		{
			"foreground": "ffffff66",
			"background": "43800033",
			"token": "string.regexp.group string.regexp.group string.regexp.group string.regexp.group"
		},
		{
			"foreground": "86ff00",
			"background": "43800033",
			"token": "string.regexp.character-class"
		},
		{
			"foreground": "00fff8",
			"background": "43800033",
			"token": "string.regexp.arbitrary-repitition"
		},
		{
			"foreground": "803d00",
			"token": "string.regexp punctuation.definition.string keyword.other"
		},
		{
			"background": "0086ff33",
			"token": "meta.group.assertion.regexp"
		},
		{
			"foreground": "0086ff",
			"token": "meta.assertion"
		},
		{
			"foreground": "0086ff",
			"token": "meta.group.assertion keyword.control.group.regexp"
		},
		{
			"foreground": "0086ff",
			"token": "meta.group.assertion punctuation.definition.group"
		},
		{
			"foreground": "c6ff00",
			"token": "constant.numeric"
		},
		{
			"foreground": "86ff00",
			"token": "constant.character"
		},
		{
			"foreground": "07ff00",
			"token": "constant.language"
		},
		{
			"foreground": "07ff00",
			"token": "keyword.other.unit"
		},
		{
			"foreground": "07ff00",
			"token": "constant.other.java"
		},
		{
			"foreground": "07ff00",
			"token": "constant.other.unit"
		},
		{
			"foreground": "07ff00",
			"background": "04800033",
			"token": "constant.language.pseudo-variable"
		},
		{
			"foreground": "00ff79",
			"token": "constant.other"
		},
		{
			"foreground": "00ff79",
			"token": "constant.block"
		},
		{
			"foreground": "00fff8",
			"token": "support.constant"
		},
		{
			"foreground": "00fff8",
			"token": "constant.name"
		},
		{
			"foreground": "00ff79",
			"background": "00807c33",
			"token": "variable.other.readwrite.global.pre-defined"
		},
		{
			"foreground": "00ff79",
			"background": "00807c33",
			"token": "variable.language"
		},
		{
			"foreground": "00fff8",
			"token": "variable.other.constant"
		},
		{
			"foreground": "00fff8",
			"background": "00807c33",
			"token": "support.variable"
		},
		{
			"foreground": "00807c",
			"background": "00438033",
			"token": "variable.other.readwrite.global"
		},
		{
			"foreground": "31a6ff",
			"token": "variable.other"
		},
		{
			"foreground": "31a6ff",
			"token": "variable.js"
		},
		{
			"foreground": "31a6ff",
			"token": "punctuation.separator.variable"
		},
		{
			"foreground": "0086ff",
			"background": "0008ff33",
			"token": "variable.other.readwrite.class"
		},
		{
			"foreground": "406180",
			"token": "variable.other.readwrite.instance"
		},
		{
			"foreground": "406180",
			"token": "variable.other.php"
		},
		{
			"foreground": "406180",
			"token": "variable.other.normal"
		},
		{
			"foreground": "00000080",
			"token": "punctuation.definition"
		},
		{
			"foreground": "00000080",
			"token": "punctuation.separator.variable"
		},
		{
			"foreground": "7e0080",
			"token": "storage -storage.modifier"
		},
		{
			"background": "803d0033",
			"token": "other.preprocessor"
		},
		{
			"background": "803d0033",
			"token": "entity.name.preprocessor"
		},
		{
			"foreground": "666666",
			"token": "variable.language.this.js"
		},
		{
			"foreground": "803d00",
			"token": "storage.modifier"
		},
		{
			"foreground": "ff0000",
			"token": "entity.name.class"
		},
		{
			"foreground": "ff0000",
			"token": "entity.name.type.class"
		},
		{
			"foreground": "ff0000",
			"token": "entity.name.type.module"
		},
		{
			"foreground": "870000",
			"background": "ff000033",
			"token": "meta.class -meta.class.instance"
		},
		{
			"foreground": "870000",
			"background": "ff000033",
			"token": "declaration.class"
		},
		{
			"foreground": "870000",
			"background": "ff000033",
			"token": "meta.definition.class"
		},
		{
			"foreground": "870000",
			"background": "ff000033",
			"token": "declaration.module"
		},
		{
			"foreground": "ff0000",
			"background": "87000033",
			"token": "support.type"
		},
		{
			"foreground": "ff0000",
			"background": "87000033",
			"token": "support.class"
		},
		{
			"foreground": "ff3d44",
			"token": "entity.name.instance"
		},
		{
			"foreground": "ff3d44",
			"token": "entity.name.type.instance"
		},
		{
			"background": "831e5133",
			"token": "meta.class.instance.constructor"
		},
		{
			"foreground": "ff0086",
			"background": "80000433",
			"token": "entity.other.inherited-class"
		},
		{
			"foreground": "ff0086",
			"background": "80000433",
			"token": "entity.name.module"
		},
		{
			"foreground": "ff0086",
			"token": "meta.definition.method"
		},
		{
			"foreground": "ff0086",
			"token": "entity.name.function"
		},
		{
			"foreground": "ff0086",
			"token": "entity.name.preprocessor"
		},
		{
			"foreground": "9799ff",
			"token": "variable.parameter.function"
		},
		{
			"foreground": "9799ff",
			"token": "variable.parameter -variable.parameter.misc.css"
		},
		{
			"foreground": "9799ff",
			"token": "meta.definition.method  meta.definition.param-list"
		},
		{
			"foreground": "9799ff",
			"token": "meta.function.method.with-arguments variable.parameter.function"
		},
		{
			"foreground": "800004",
			"token": "punctuation.definition.parameters"
		},
		{
			"foreground": "800004",
			"token": "variable.parameter.function punctuation.separator.object"
		},
		{
			"foreground": "782ec1",
			"token": "keyword.other.special-method"
		},
		{
			"foreground": "782ec1",
			"token": "meta.function-call entity.name.function -(meta.function-call meta.function)"
		},
		{
			"foreground": "782ec1",
			"token": "support.function - variable"
		},
		{
			"foreground": "9d3eff",
			"token": "meta.function-call support.function - variable"
		},
		{
			"foreground": "603f80",
			"background": "603f8033",
			"token": "support.function"
		},
		{
			"foreground": "bc80ff",
			"token": "punctuation.section.function"
		},
		{
			"foreground": "bc80ff",
			"token": "meta.brace.curly.function"
		},
		{
			"foreground": "bc80ff",
			"token": "meta.function-call punctuation.section.scope.ruby"
		},
		{
			"foreground": "bc80ff",
			"token": "meta.function-call punctuation.separator.object"
		},
		{
			"foreground": "bc80ff",
			"fontStyle": "bold",
			"token": "meta.group.braces.round punctuation.section.scope"
		},
		{
			"foreground": "bc80ff",
			"fontStyle": "bold",
			"token": "meta.group.braces.round meta.delimiter.object.comma"
		},
		{
			"foreground": "bc80ff",
			"fontStyle": "bold",
			"token": "meta.group.braces.curly.function meta.delimiter.object.comma"
		},
		{
			"foreground": "bc80ff",
			"fontStyle": "bold",
			"token": "meta.brace.round"
		},
		{
			"foreground": "a88fc0",
			"token": "meta.function-call.method.without-arguments"
		},
		{
			"foreground": "a88fc0",
			"token": "meta.function-call.method.without-arguments entity.name.function"
		},
		{
			"foreground": "f800ff",
			"token": "keyword.control"
		},
		{
			"foreground": "7900ff",
			"token": "keyword.other"
		},
		{
			"foreground": "0000ce",
			"token": "keyword.operator"
		},
		{
			"foreground": "0000ce",
			"token": "declaration.function.operator"
		},
		{
			"foreground": "0000ce",
			"token": "meta.preprocessor.c.include"
		},
		{
			"foreground": "0000ce",
			"token": "punctuation.separator.operator"
		},
		{
			"foreground": "0000ce",
			"background": "00009a33",
			"token": "keyword.operator.assignment"
		},
		{
			"foreground": "2136ce",
			"token": "keyword.operator.arithmetic"
		},
		{
			"foreground": "3759ff",
			"background": "00009a33",
			"token": "keyword.operator.logical"
		},
		{
			"foreground": "7c88ff",
			"token": "keyword.operator.comparison"
		},
		{
			"foreground": "800043",
			"token": "meta.class.instance.constructor keyword.operator.new"
		},
		{
			"foreground": "cccccc",
			"background": "333333",
			"token": "meta.doctype"
		},
		{
			"foreground": "cccccc",
			"background": "333333",
			"token": "meta.tag.sgml-declaration.doctype"
		},
		{
			"foreground": "cccccc",
			"background": "333333",
			"token": "meta.tag.sgml.doctype"
		},
		{
			"foreground": "333333",
			"token": "meta.tag"
		},
		{
			"foreground": "666666",
			"background": "333333bf",
			"token": "meta.tag.structure"
		},
		{
			"foreground": "666666",
			"background": "333333bf",
			"token": "meta.tag.segment"
		},
		{
			"foreground": "4c4c4c",
			"background": "4c4c4c33",
			"token": "meta.tag.block"
		},
		{
			"foreground": "4c4c4c",
			"background": "4c4c4c33",
			"token": "meta.tag.xml"
		},
		{
			"foreground": "4c4c4c",
			"background": "4c4c4c33",
			"token": "meta.tag.key"
		},
		{
			"foreground": "ff7900",
			"background": "803d0033",
			"token": "meta.tag.inline"
		},
		{
			"background": "803d0033",
			"token": "meta.tag.inline source"
		},
		{
			"foreground": "ff0007",
			"background": "80000433",
			"token": "meta.tag.other"
		},
		{
			"foreground": "ff0007",
			"background": "80000433",
			"token": "entity.name.tag.style"
		},
		{
			"foreground": "ff0007",
			"background": "80000433",
			"token": "entity.name.tag.script"
		},
		{
			"foreground": "ff0007",
			"background": "80000433",
			"token": "meta.tag.block.script"
		},
		{
			"foreground": "ff0007",
			"background": "80000433",
			"token": "source.js.embedded punctuation.definition.tag.html"
		},
		{
			"foreground": "ff0007",
			"background": "80000433",
			"token": "source.css.embedded punctuation.definition.tag.html"
		},
		{
			"foreground": "0086ff",
			"background": "00438033",
			"token": "meta.tag.form"
		},
		{
			"foreground": "0086ff",
			"background": "00438033",
			"token": "meta.tag.block.form"
		},
		{
			"foreground": "f800ff",
			"background": "3c008033",
			"token": "meta.tag.meta"
		},
		{
			"background": "121212",
			"token": "meta.section.html.head"
		},
		{
			"background": "0043801a",
			"token": "meta.section.html.form"
		},
		{
			"foreground": "666666",
			"token": "meta.tag.xml"
		},
		{
			"foreground": "ffffff4d",
			"token": "entity.name.tag"
		},
		{
			"foreground": "ffffff33",
			"token": "entity.other.attribute-name"
		},
		{
			"foreground": "ffffff33",
			"token": "meta.tag punctuation.definition.string"
		},
		{
			"foreground": "ffffff66",
			"token": "meta.tag string -source -punctuation"
		},
		{
			"foreground": "ffffff66",
			"token": "text source text meta.tag string -punctuation"
		},
		{
			"foreground": "999999",
			"token": "text meta.paragraph"
		},
		{
			"foreground": "fff800",
			"background": "33333333",
			"token": "markup markup -(markup meta.paragraph.list)"
		},
		{
			"foreground": "000000",
			"background": "ffffff",
			"token": "markup.hr"
		},
		{
			"foreground": "ffffff",
			"token": "markup.heading"
		},
		{
			"foreground": "95d4ff80",
			"fontStyle": "bold",
			"token": "markup.bold"
		},
		{
			"fontStyle": "italic",
			"token": "markup.italic"
		},
		{
			"fontStyle": "underline",
			"token": "markup.underline"
		},
		{
			"foreground": "0086ff",
			"token": "meta.reference"
		},
		{
			"foreground": "0086ff",
			"token": "markup.underline.link"
		},
		{
			"foreground": "00fff8",
			"background": "00438033",
			"token": "entity.name.reference"
		},
		{
			"foreground": "00fff8",
			"fontStyle": "underline",
			"token": "meta.reference.list markup.underline.link"
		},
		{
			"foreground": "00fff8",
			"fontStyle": "underline",
			"token": "text.html.textile markup.underline.link"
		},
		{
			"background": "80808040",
			"token": "markup.raw.block"
		},
		{
			"background": "ffffff1a",
			"token": "markup.quote"
		},
		{
			"foreground": "ffffff",
			"token": "markup.list meta.paragraph"
		},
		{
			"foreground": "000000",
			"background": "ffffff",
			"token": "text.html.markdown"
		},
		{
			"foreground": "000000",
			"token": "text.html.markdown meta.paragraph"
		},
		{
			"foreground": "555555",
			"token": "text.html.markdown markup.list meta.paragraph"
		},
		{
			"foreground": "000000",
			"fontStyle": "bold",
			"token": "text.html.markdown markup.heading"
		},
		{
			"foreground": "8a5420",
			"token": "text.html.markdown string"
		},
		{
			"foreground": "666666",
			"token": "meta.selector"
		},
		{
			"foreground": "006680",
			"token": "source.css meta.scope.property-list meta.property-value punctuation.definition.arguments"
		},
		{
			"foreground": "006680",
			"token": "source.css meta.scope.property-list meta.property-value punctuation.separator.arguments"
		},
		{
			"foreground": "4f00ff",
			"token": "entity.other.attribute-name.pseudo-element"
		},
		{
			"foreground": "7900ff",
			"token": "entity.other.attribute-name.pseudo-class"
		},
		{
			"foreground": "7900ff",
			"token": "entity.other.attribute-name.tag.pseudo-class"
		},
		{
			"foreground": "f800ff",
			"token": "meta.selector entity.other.attribute-name.class"
		},
		{
			"foreground": "ff0086",
			"token": "meta.selector entity.other.attribute-name.id"
		},
		{
			"foreground": "ff0007",
			"token": "meta.selector entity.name.tag"
		},
		{
			"foreground": "ff7900",
			"fontStyle": "bold",
			"token": "entity.name.tag.wildcard"
		},
		{
			"foreground": "ff7900",
			"fontStyle": "bold",
			"token": "entity.other.attribute-name.universal"
		},
		{
			"foreground": "c25a00",
			"token": "source.css entity.other.attribute-name.attribute"
		},
		{
			"foreground": "673000",
			"token": "source.css meta.attribute-selector keyword.operator.comparison"
		},
		{
			"foreground": "333333",
			"fontStyle": "bold",
			"token": "meta.scope.property-list"
		},
		{
			"foreground": "999999",
			"token": "meta.property-name"
		},
		{
			"foreground": "ffffff",
			"background": "0d0d0d",
			"token": "support.type.property-name"
		},
		{
			"foreground": "999999",
			"background": "19191980",
			"token": "meta.property-value"
		},
		{
			"background": "000000",
			"token": "text.latex markup.raw"
		},
		{
			"foreground": "bc80ff",
			"token": "text.latex support.function -support.function.textit -support.function.emph"
		},
		{
			"foreground": "ffffffbf",
			"token": "text.latex support.function.section"
		},
		{
			"foreground": "000000",
			"background": "ffffff",
			"token": "text.latex entity.name.section -meta.group -keyword.operator.braces"
		},
		{
			"background": "00000080",
			"token": "text.latex keyword.operator.delimiter"
		},
		{
			"foreground": "999999",
			"token": "text.latex keyword.operator.brackets"
		},
		{
			"foreground": "666666",
			"token": "text.latex keyword.operator.braces"
		},
		{
			"foreground": "0008ff4d",
			"background": "00008033",
			"token": "meta.footnote"
		},
		{
			"background": "ffffff0d",
			"token": "text.latex meta.label.reference"
		},
		{
			"foreground": "ff0007",
			"background": "260001",
			"token": "text.latex keyword.control.ref"
		},
		{
			"foreground": "ffbc80",
			"background": "400002",
			"token": "text.latex variable.parameter.label.reference"
		},
		{
			"foreground": "ff0086",
			"background": "260014",
			"token": "text.latex keyword.control.cite"
		},
		{
			"foreground": "ffbfe1",
			"background": "400022",
			"token": "variable.parameter.cite"
		},
		{
			"foreground": "ffffff80",
			"token": "text.latex variable.parameter.label"
		},
		{
			"foreground": "cdcdcd",
			"token": "meta.function markup"
		},
		{
			"foreground": "33333333",
			"token": "text.latex meta.group.braces"
		},
		{
			"foreground": "33333333",
			"background": "00000080",
			"token": "text.latex meta.environment.list"
		},
		{
			"foreground": "33333333",
			"background": "00000080",
			"token": "text.latex meta.environment.list meta.environment.list"
		},
		{
			"foreground": "33333333",
			"background": "000000",
			"token": "text.latex meta.environment.list meta.environment.list meta.environment.list"
		},
		{
			"foreground": "33333333",
			"token": "text.latex meta.environment.list meta.environment.list meta.environment.list meta.environment.list"
		},
		{
			"foreground": "33333333",
			"token": "text.latex meta.environment.list meta.environment.list meta.environment.list meta.environment.list meta.environment.list"
		},
		{
			"foreground": "33333333",
			"token": "text.latex meta.environment.list meta.environment.list meta.environment.list meta.environment.list meta.environment.list meta.environment.list"
		},
		{
			"foreground": "000000",
			"background": "cccccc",
			"token": "text.latex meta.end-document"
		},
		{
			"foreground": "000000",
			"background": "cccccc",
			"token": "text.latex meta.begin-document"
		},
		{
			"foreground": "000000",
			"background": "cccccc",
			"token": "meta.end-document.latex support.function"
		},
		{
			"foreground": "000000",
			"background": "cccccc",
			"token": "meta.end-document.latex variable.parameter"
		},
		{
			"foreground": "000000",
			"background": "cccccc",
			"token": "meta.begin-document.latex support.function"
		},
		{
			"foreground": "000000",
			"background": "cccccc",
			"token": "meta.begin-document.latex variable.parameter"
		},
		{
			"foreground": "00ffaa",
			"background": "00805533",
			"token": "meta.brace.erb.return-value"
		},
		{
			"background": "8080801a",
			"token": "source.ruby.rails.embedded.return-value.one-line"
		},
		{
			"foreground": "00fff8",
			"background": "00fff81a",
			"token": "punctuation.section.embedded -(source string source punctuation.section.embedded)"
		},
		{
			"foreground": "00fff8",
			"background": "00fff81a",
			"token": "meta.brace.erb.html"
		},
		{
			"background": "00fff81a",
			"token": "source.ruby.rails.embedded.one-line"
		},
		{
			"foreground": "406180",
			"token": "source string source punctuation.section.embedded"
		},
		{
			"background": "0d0d0d",
			"token": "source.js.embedded"
		},
		{
			"background": "000000",
			"token": "meta.brace.erb"
		},
		{
			"foreground": "ffffff",
			"background": "33333380",
			"token": "source string source"
		},
		{
			"foreground": "999999",
			"background": "00000099",
			"token": "source string.interpolated source"
		},
		{
			"background": "3333331a",
			"token": "source source"
		},
		{
			"background": "3333331a",
			"token": "source.java.embedded"
		},
		{
			"foreground": "ffffff",
			"token": "text -text.xml.strict"
		},
		{
			"foreground": "cccccc",
			"background": "000000",
			"token": "text source"
		},
		{
			"foreground": "cccccc",
			"background": "000000",
			"token": "meta.scope.django.template"
		},
		{
			"foreground": "999999",
			"token": "text string source"
		},
		{
			"foreground": "330004",
			"background": "ff0007",
			"fontStyle": "bold",
			"token": "invalid -invalid.SOMETHING"
		},
		{
			"foreground": "ff3600",
			"fontStyle": "underline",
			"token": "invalid.SOMETHING"
		},
		{
			"foreground": "333333",
			"token": "meta.syntax"
		},
		{
			"foreground": "4c4c4c",
			"background": "33333333",
			"token": "comment -comment.line"
		},
		{
			"foreground": "4c4c4c",
			"fontStyle": "italic",
			"token": "comment.line"
		},
		{
			"fontStyle": "italic",
			"token": "text comment.block -source"
		},
		{
			"foreground": "40ff9a",
			"background": "00401e",
			"token": "markup.inserted"
		},
		{
			"foreground": "ff40a3",
			"background": "400022",
			"token": "markup.deleted"
		},
		{
			"foreground": "ffff55",
			"background": "803d00",
			"token": "markup.changed"
		},
		{
			"foreground": "ffffff",
			"background": "000000",
			"token": "text.subversion-commit meta.scope.changed-files"
		},
		{
			"foreground": "ffffff",
			"background": "000000",
			"token": "text.subversion-commit meta.scope.changed-files.svn meta.diff.separator"
		},
		{
			"foreground": "000000",
			"background": "ffffff",
			"token": "text.subversion-commit"
		},
		{
			"foreground": "7f7f7f",
			"background": "ffffff03",
			"fontStyle": "bold",
			"token": "punctuation.terminator"
		},
		{
			"foreground": "7f7f7f",
			"background": "ffffff03",
			"fontStyle": "bold",
			"token": "meta.delimiter"
		},
		{
			"foreground": "7f7f7f",
			"background": "ffffff03",
			"fontStyle": "bold",
			"token": "punctuation.separator.method"
		},
		{
			"background": "00000080",
			"token": "punctuation.terminator.statement"
		},
		{
			"background": "00000080",
			"token": "meta.delimiter.statement.js"
		},
		{
			"background": "00000040",
			"token": "meta.delimiter.object.js"
		},
		{
			"foreground": "803d00",
			"fontStyle": "bold",
			"token": "string.quoted.single.brace"
		},
		{
			"foreground": "803d00",
			"fontStyle": "bold",
			"token": "string.quoted.double.brace"
		},
		{
			"foreground": "333333",
			"background": "dcdcdc",
			"token": "text.blog"
		},
		{
			"foreground": "333333",
			"background": "dcdcdc",
			"token": "text.mail"
		},
		{
			"foreground": "cccccc",
			"background": "000000",
			"token": "text.blog text"
		},
		{
			"foreground": "cccccc",
			"background": "000000",
			"token": "text.mail text"
		},
		{
			"foreground": "06403e",
			"background": "00fff81a",
			"token": "meta.header.blog keyword.other"
		},
		{
			"foreground": "06403e",
			"background": "00fff81a",
			"token": "meta.header.mail keyword.other"
		},
		{
			"foreground": "803d00",
			"background": "ffff551a",
			"token": "meta.header.blog string.unquoted.blog"
		},
		{
			"foreground": "803d00",
			"background": "ffff551a",
			"token": "meta.header.mail string.unquoted"
		},
		{
			"foreground": "ff0000",
			"token": "source.ocaml entity.name.type.module"
		},
		{
			"foreground": "ff0000",
			"background": "83000033",
			"token": "source.ocaml support.other.module"
		},
		{
			"foreground": "00fff8",
			"token": "entity.name.type.variant"
		},
		{
			"foreground": "00ff79",
			"token": "source.ocaml entity.name.tag"
		},
		{
			"foreground": "00ff79",
			"token": "source.ocaml meta.record.definition"
		},
		{
			"foreground": "ffffff",
			"fontStyle": "bold",
			"token": "punctuation.separator.parameters"
		},
		{
			"foreground": "4c4c4c",
			"background": "33333333",
			"token": "meta.brace.pipe"
		},
		{
			"foreground": "666666",
			"fontStyle": "bold",
			"token": "meta.brace.erb"
		},
		{
			"foreground": "666666",
			"fontStyle": "bold",
			"token": "source.ruby.embedded.source.brace"
		},
		{
			"foreground": "666666",
			"fontStyle": "bold",
			"token": "punctuation.section.dictionary"
		},
		{
			"foreground": "666666",
			"fontStyle": "bold",
			"token": "punctuation.terminator.dictionary"
		},
		{
			"foreground": "666666",
			"fontStyle": "bold",
			"token": "punctuation.separator.object"
		},
		{
			"foreground": "666666",
			"fontStyle": "bold",
			"token": "punctuation.separator.statement"
		},
		{
			"foreground": "666666",
			"fontStyle": "bold",
			"token": "punctuation.separator.key-value.css"
		},
		{
			"foreground": "999999",
			"fontStyle": "bold",
			"token": "punctuation.section.scope.curly"
		},
		{
			"foreground": "999999",
			"fontStyle": "bold",
			"token": "punctuation.section.scope"
		},
		{
			"foreground": "0c823b",
			"fontStyle": "bold",
			"token": "punctuation.separator.objects"
		},
		{
			"foreground": "0c823b",
			"fontStyle": "bold",
			"token": "meta.group.braces.curly meta.delimiter.object.comma"
		},
		{
			"foreground": "0c823b",
			"fontStyle": "bold",
			"token": "punctuation.separator.key-value -meta.tag"
		},
		{
			"foreground": "0c823b",
			"fontStyle": "bold",
			"token": "source.ocaml punctuation.separator.match-definition"
		},
		{
			"foreground": "800043",
			"token": "punctuation.separator.parameters.function.js"
		},
		{
			"foreground": "800043",
			"token": "punctuation.definition.function"
		},
		{
			"foreground": "800043",
			"token": "punctuation.separator.function-return"
		},
		{
			"foreground": "800043",
			"token": "punctuation.separator.function-definition"
		},
		{
			"foreground": "800043",
			"token": "punctuation.definition.arguments"
		},
		{
			"foreground": "800043",
			"token": "punctuation.separator.arguments"
		},
		{
			"foreground": "7f5e40",
			"background": "803d001a",
			"fontStyle": "bold",
			"token": "meta.group.braces.square punctuation.section.scope"
		},
		{
			"foreground": "7f5e40",
			"background": "803d001a",
			"fontStyle": "bold",
			"token": "meta.group.braces.square meta.delimiter.object.comma"
		},
		{
			"foreground": "7f5e40",
			"background": "803d001a",
			"fontStyle": "bold",
			"token": "meta.brace.square"
		},
		{
			"foreground": "7f5e40",
			"background": "803d001a",
			"fontStyle": "bold",
			"token": "punctuation.separator.array"
		},
		{
			"foreground": "7f5e40",
			"background": "803d001a",
			"fontStyle": "bold",
			"token": "punctuation.section.array"
		},
		{
			"foreground": "7f5e40",
			"background": "803d001a",
			"fontStyle": "bold",
			"token": "punctuation.definition.array"
		},
		{
			"foreground": "7f5e40",
			"background": "803d001a",
			"fontStyle": "bold",
			"token": "punctuation.definition.constant.range"
		},
		{
			"background": "803d001a",
			"token": "meta.structure.array -punctuation.definition.array"
		},
		{
			"background": "803d001a",
			"token": "meta.definition.range -punctuation.definition.constant.range"
		},
		{
			"background": "00000080",
			"token": "meta.brace.curly meta.group.css"
		},
		{
			"foreground": "666666",
			"background": "00000080",
			"token": "meta.source.embedded"
		},
		{
			"foreground": "666666",
			"background": "00000080",
			"token": "entity.other.django.tagbraces"
		},
		{
			"background": "00000080",
			"token": "source.ruby meta.even-tab"
		},
		{
			"background": "00000080",
			"token": "source.ruby meta.even-tab.group2"
		},
		{
			"background": "00000080",
			"token": "source.ruby meta.even-tab.group4"
		},
		{
			"background": "00000080",
			"token": "source.ruby meta.even-tab.group6"
		},
		{
			"background": "00000080",
			"token": "source.ruby meta.even-tab.group8"
		},
		{
			"background": "00000080",
			"token": "source.ruby meta.even-tab.group10"
		},
		{
			"background": "00000080",
			"token": "source.ruby meta.even-tab.group12"
		},
		{
			"foreground": "666666",
			"token": "meta.block.slate"
		},
		{
			"foreground": "cccccc",
			"token": "meta.block.content.slate"
		},
		{
			"background": "0a0a0a",
			"token": "meta.odd-tab.group1"
		},
		{
			"background": "0a0a0a",
			"token": "meta.group.braces"
		},
		{
			"background": "0a0a0a",
			"token": "meta.block.slate"
		},
		{
			"background": "0a0a0a",
			"token": "text.xml.strict meta.tag"
		},
		{
			"background": "0a0a0a",
			"token": "meta.paren-group"
		},
		{
			"background": "0a0a0a",
			"token": "meta.section"
		},
		{
			"background": "0e0e0e",
			"token": "meta.even-tab.group2"
		},
		{
			"background": "0e0e0e",
			"token": "meta.group.braces meta.group.braces"
		},
		{
			"background": "0e0e0e",
			"token": "meta.block.slate meta.block.slate"
		},
		{
			"background": "0e0e0e",
			"token": "text.xml.strict meta.tag meta.tag"
		},
		{
			"background": "0e0e0e",
			"token": "meta.group.braces meta.group.braces"
		},
		{
			"background": "0e0e0e",
			"token": "meta.paren-group meta.paren-group"
		},
		{
			"background": "0e0e0e",
			"token": "meta.section meta.section"
		},
		{
			"background": "111111",
			"token": "meta.odd-tab.group3"
		},
		{
			"background": "111111",
			"token": "meta.group.braces meta.group.braces meta.group.braces"
		},
		{
			"background": "111111",
			"token": "meta.block.slate meta.block.slate meta.block.slate"
		},
		{
			"background": "111111",
			"token": "text.xml.strict meta.tag meta.tag meta.tag"
		},
		{
			"background": "111111",
			"token": "meta.group.braces meta.group.braces meta.group.braces"
		},
		{
			"background": "111111",
			"token": "meta.paren-group meta.paren-group meta.paren-group"
		},
		{
			"background": "111111",
			"token": "meta.section meta.section meta.section"
		},
		{
			"background": "151515",
			"token": "meta.even-tab.group4"
		},
		{
			"background": "151515",
			"token": "meta.group.braces meta.group.braces meta.group.braces meta.group.braces"
		},
		{
			"background": "151515",
			"token": "meta.block.slate meta.block.slate meta.block.slate meta.block.slate"
		},
		{
			"background": "151515",
			"token": "text.xml.strict meta.tag meta.tag meta.tag meta.tag"
		},
		{
			"background": "151515",
			"token": "meta.group.braces meta.group.braces meta.group.braces meta.group.braces"
		},
		{
			"background": "151515",
			"token": "meta.paren-group meta.paren-group meta.paren-group meta.paren-group"
		},
		{
			"background": "151515",
			"token": "meta.section meta.section meta.section meta.section"
		},
		{
			"background": "191919",
			"token": "meta.odd-tab.group5"
		},
		{
			"background": "191919",
			"token": "meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces"
		},
		{
			"background": "191919",
			"token": "meta.block.slate meta.block.slate meta.block.slate meta.block.slate meta.block.slate"
		},
		{
			"background": "191919",
			"token": "text.xml.strict meta.tag meta.tag meta.tag meta.tag meta.tag"
		},
		{
			"background": "191919",
			"token": "meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces"
		},
		{
			"background": "191919",
			"token": "meta.paren-group meta.paren-group meta.paren-group meta.paren-group meta.paren-group"
		},
		{
			"background": "191919",
			"token": "meta.section meta.section meta.section meta.section meta.section"
		},
		{
			"background": "1c1c1c",
			"token": "meta.even-tab.group6"
		},
		{
			"background": "1c1c1c",
			"token": "meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces"
		},
		{
			"background": "1c1c1c",
			"token": "meta.block.slate meta.block.slate meta.block.slate meta.block.slate meta.block.slate meta.block.slate"
		},
		{
			"background": "1c1c1c",
			"token": "text.xml.strict meta.tag meta.tag meta.tag meta.tag meta.tag meta.tag"
		},
		{
			"background": "1c1c1c",
			"token": "meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces"
		},
		{
			"background": "1c1c1c",
			"token": "meta.paren-group meta.paren-group meta.paren-group meta.paren-group meta.paren-group meta.paren-group"
		},
		{
			"background": "1c1c1c",
			"token": "meta.section meta.section meta.section meta.section meta.section meta.section"
		},
		{
			"background": "1f1f1f",
			"token": "meta.odd-tab.group7"
		},
		{
			"background": "1f1f1f",
			"token": "meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces"
		},
		{
			"background": "1f1f1f",
			"token": "meta.block.slate meta.block.slate meta.block.slate meta.block.slate meta.block.slate meta.block.slate meta.block.slate"
		},
		{
			"background": "1f1f1f",
			"token": "text.xml.strict meta.tag meta.tag meta.tag meta.tag meta.tag meta.tag meta.tag"
		},
		{
			"background": "1f1f1f",
			"token": "meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces"
		},
		{
			"background": "1f1f1f",
			"token": "meta.paren-group meta.paren-group meta.paren-group meta.paren-group meta.paren-group meta.paren-group meta.paren-group"
		},
		{
			"background": "1f1f1f",
			"token": "meta.section meta.section meta.section meta.section meta.section meta.section meta.section"
		},
		{
			"background": "212121",
			"token": "meta.even-tab.group8"
		},
		{
			"background": "212121",
			"token": "meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces"
		},
		{
			"background": "212121",
			"token": "meta.block.slate meta.block.slate meta.block.slate meta.block.slate meta.block.slate meta.block.slate meta.block.slate meta.block.slate"
		},
		{
			"background": "212121",
			"token": "text.xml.strict meta.tag meta.tag meta.tag meta.tag meta.tag meta.tag meta.tag meta.tag"
		},
		{
			"background": "212121",
			"token": "meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces"
		},
		{
			"background": "212121",
			"token": "meta.paren-group meta.paren-group meta.paren-group meta.paren-group meta.paren-group meta.paren-group meta.paren-group meta.paren-group"
		},
		{
			"background": "212121",
			"token": "meta.section meta.section meta.section meta.section meta.section meta.section meta.section meta.section"
		},
		{
			"background": "242424",
			"token": "meta.odd-tab.group9"
		},
		{
			"background": "242424",
			"token": "meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces"
		},
		{
			"background": "242424",
			"token": "meta.block.slate meta.block.slate meta.block.slate meta.block.slate meta.block.slate meta.block.slate meta.block.slate meta.block.slate meta.block.slate"
		},
		{
			"background": "242424",
			"token": "text.xml.strict meta.tag meta.tag meta.tag meta.tag meta.tag meta.tag meta.tag meta.tag meta.tag"
		},
		{
			"background": "242424",
			"token": "meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces"
		},
		{
			"background": "242424",
			"token": "meta.paren-group meta.paren-group meta.paren-group meta.paren-group meta.paren-group meta.paren-group meta.paren-group meta.paren-group meta.paren-group"
		},
		{
			"background": "242424",
			"token": "meta.section meta.section meta.section meta.section meta.section meta.section meta.section meta.section meta.section"
		},
		{
			"background": "1f1f1f",
			"token": "meta.even-tab.group10"
		},
		{
			"background": "151515",
			"token": "meta.odd-tab.group11"
		},
		{
			"foreground": "1b95e2",
			"token": "meta.property.vendor.microsoft.trident.4"
		},
		{
			"foreground": "1b95e2",
			"token": "meta.property.vendor.microsoft.trident.4 support.type.property-name"
		},
		{
			"foreground": "1b95e2",
			"token": "meta.property.vendor.microsoft.trident.4 punctuation.terminator.rule"
		},
		{
			"foreground": "f5c034",
			"token": "meta.property.vendor.microsoft.trident.5"
		},
		{
			"foreground": "f5c034",
			"token": "meta.property.vendor.microsoft.trident.5 support.type.property-name"
		},
		{
			"foreground": "f5c034",
			"token": "meta.property.vendor.microsoft.trident.5 punctuation.separator.key-value"
		},
		{
			"foreground": "f5c034",
			"token": "meta.property.vendor.microsoft.trident.5 punctuation.terminator.rule"
		}
	],
	"colors": {
		"editor.foreground": "#EEEEEE",
		"editor.background": "#0D0D0DFA",
		"editor.selectionBackground": "#0010B499",
		"editor.lineHighlightBackground": "#00008033",
		"editorCursor.foreground": "#3333FF",
		"editorWhitespace.foreground": "#CCCCCC1A"
	}
} as Monaco.editor.IStandaloneThemeData

let brillianceDull = {
	"base": "vs-dark",
	"inherit": true,
	"rules": [
		{
			"background": "050505FA",
			"token": ""
		},
		{
			"foreground": "000000",
			"background": "ffffff",
			"fontStyle": "bold",
			"token": "meta.thomas_aylott"
		},
		{
			"foreground": "555555",
			"background": "ffffff",
			"fontStyle": "underline",
			"token": "meta.subtlegradient"
		},
		{
			"foreground": "e6e6e6",
			"background": "ffffff",
			"token": "meta.subtlegradient"
		},
		{
			"foreground": "d2d1ab",
			"background": "803d0033",
			"token": "string -meta.tag -meta.doctype -string.regexp -string.literal -string.interpolated -string.quoted.literal -string.unquoted"
		},
		{
			"foreground": "d2d1ab",
			"background": "803d0033",
			"token": "variable.parameter.misc.css"
		},
		{
			"foreground": "d2d1ab",
			"background": "803d0033",
			"token": "text string source string"
		},
		{
			"foreground": "d2d1ab",
			"background": "803d0033",
			"token": "string.unquoted string"
		},
		{
			"foreground": "d2d1ab",
			"background": "803d0033",
			"token": "string.regexp string"
		},
		{
			"foreground": "533f2c",
			"token": "punctuation.definition.string -meta.tag"
		},
		{
			"foreground": "fff80033",
			"token": "string.regexp punctuation.definition.string"
		},
		{
			"foreground": "fff80033",
			"token": "string.quoted.literal punctuation.definition.string"
		},
		{
			"foreground": "fff80033",
			"token": "string.quoted.double.ruby.mod punctuation.definition.string"
		},
		{
			"foreground": "a6a458",
			"background": "43800033",
			"token": "string.quoted.literal"
		},
		{
			"foreground": "a6a458",
			"background": "43800033",
			"token": "string.quoted.double.ruby.mod"
		},
		{
			"foreground": "d2beab",
			"token": "string.unquoted -string.unquoted.embedded"
		},
		{
			"foreground": "d2beab",
			"token": "string.quoted.double.multiline"
		},
		{
			"foreground": "d2beab",
			"token": "meta.scope.heredoc"
		},
		{
			"foreground": "d2d1ab",
			"background": "1a1a1a",
			"token": "string.interpolated"
		},
		{
			"foreground": "a6a458",
			"background": "43800033",
			"token": "string.regexp"
		},
		{
			"background": "43800033",
			"token": "string.regexp.group"
		},
		{
			"foreground": "ffffff66",
			"background": "43800033",
			"token": "string.regexp.group string.regexp.group"
		},
		{
			"foreground": "ffffff66",
			"background": "43800033",
			"token": "string.regexp.group string.regexp.group string.regexp.group"
		},
		{
			"foreground": "ffffff66",
			"background": "43800033",
			"token": "string.regexp.group string.regexp.group string.regexp.group string.regexp.group"
		},
		{
			"foreground": "80a659",
			"background": "43800033",
			"token": "string.regexp.character-class"
		},
		{
			"foreground": "56a5a4",
			"background": "43800033",
			"token": "string.regexp.arbitrary-repitition"
		},
		{
			"foreground": "a75980",
			"token": "source.regexp keyword.operator"
		},
		{
			"foreground": "ffffff",
			"fontStyle": "italic",
			"token": "string.regexp comment"
		},
		{
			"background": "0086ff33",
			"token": "meta.group.assertion.regexp"
		},
		{
			"foreground": "5780a6",
			"token": "meta.assertion"
		},
		{
			"foreground": "5780a6",
			"token": "meta.group.assertion keyword.control.group.regexp"
		},
		{
			"foreground": "95a658",
			"token": "constant.numeric"
		},
		{
			"foreground": "80a659",
			"token": "constant.character"
		},
		{
			"foreground": "59a559",
			"token": "constant.language"
		},
		{
			"foreground": "59a559",
			"token": "keyword.other.unit"
		},
		{
			"foreground": "59a559",
			"token": "constant.other.java"
		},
		{
			"foreground": "59a559",
			"token": "constant.other.unit"
		},
		{
			"foreground": "59a559",
			"background": "04800033",
			"token": "constant.language.pseudo-variable"
		},
		{
			"foreground": "57a57d",
			"token": "constant.other"
		},
		{
			"foreground": "57a57d",
			"token": "constant.block"
		},
		{
			"foreground": "56a5a4",
			"token": "support.constant"
		},
		{
			"foreground": "56a5a4",
			"token": "constant.name"
		},
		{
			"foreground": "5e6b6b",
			"token": "variable.language"
		},
		{
			"foreground": "5e6b6b",
			"token": "variable.other.readwrite.global.pre-defined"
		},
		{
			"foreground": "56a5a4",
			"token": "variable.other.constant"
		},
		{
			"foreground": "56a5a4",
			"background": "00807c33",
			"token": "support.variable"
		},
		{
			"foreground": "2b5252",
			"background": "00438033",
			"token": "variable.other.readwrite.global"
		},
		{
			"foreground": "5780a6",
			"token": "variable.other"
		},
		{
			"foreground": "5780a6",
			"token": "variable.js"
		},
		{
			"foreground": "5780a6",
			"background": "0007ff33",
			"token": "variable.other.readwrite.class"
		},
		{
			"foreground": "555f69",
			"token": "variable.other.readwrite.instance"
		},
		{
			"foreground": "555f69",
			"token": "variable.other.php"
		},
		{
			"foreground": "555f69",
			"token": "variable.other.normal"
		},
		{
			"foreground": "00000080",
			"token": "punctuation.definition -punctuation.definition.comment"
		},
		{
			"foreground": "00000080",
			"token": "punctuation.separator.variable"
		},
		{
			"foreground": "a77d58",
			"token": "storage -storage.modifier"
		},
		{
			"background": "803d0033",
			"token": "other.preprocessor"
		},
		{
			"background": "803d0033",
			"token": "entity.name.preprocessor"
		},
		{
			"foreground": "666666",
			"token": "variable.language.this.js"
		},
		{
			"foreground": "533f2c",
			"token": "storage.modifier"
		},
		{
			"foreground": "a7595a",
			"token": "entity.name.class"
		},
		{
			"foreground": "a7595a",
			"token": "entity.name.type.class"
		},
		{
			"foreground": "a7595a",
			"token": "entity.name.type.module"
		},
		{
			"foreground": "532d2d",
			"background": "29161780",
			"token": "meta.class -meta.class.instance"
		},
		{
			"foreground": "532d2d",
			"background": "29161780",
			"token": "declaration.class"
		},
		{
			"foreground": "532d2d",
			"background": "29161780",
			"token": "meta.definition.class"
		},
		{
			"foreground": "532d2d",
			"background": "29161780",
			"token": "declaration.module"
		},
		{
			"foreground": "a7595a",
			"background": "80000433",
			"token": "support.type"
		},
		{
			"foreground": "a7595a",
			"background": "80000433",
			"token": "support.class"
		},
		{
			"foreground": "a7595a",
			"token": "entity.name.instance"
		},
		{
			"background": "80004333",
			"token": "meta.class.instance.constructor"
		},
		{
			"foreground": "a75980",
			"background": "80000433",
			"token": "entity.other.inherited-class"
		},
		{
			"foreground": "a75980",
			"background": "80000433",
			"token": "entity.name.module"
		},
		{
			"foreground": "a75980",
			"token": "object.property.function"
		},
		{
			"foreground": "a75980",
			"token": "meta.definition.method"
		},
		{
			"foreground": "532d40",
			"background": "80004333",
			"token": "meta.function -(meta.tell-block)"
		},
		{
			"foreground": "532d40",
			"background": "80004333",
			"token": "meta.property.function"
		},
		{
			"foreground": "532d40",
			"background": "80004333",
			"token": "declaration.function"
		},
		{
			"foreground": "a75980",
			"token": "entity.name.function"
		},
		{
			"foreground": "a75980",
			"token": "entity.name.preprocessor"
		},
		{
			"foreground": "a459a5",
			"token": "keyword"
		},
		{
			"foreground": "a459a5",
			"background": "3c008033",
			"token": "keyword.control"
		},
		{
			"foreground": "8d809d",
			"token": "keyword.other.special-method"
		},
		{
			"foreground": "8d809d",
			"token": "meta.function-call entity.name.function -(meta.function-call meta.function)"
		},
		{
			"foreground": "8d809d",
			"token": "support.function - variable"
		},
		{
			"foreground": "634683",
			"token": "support.function - variable"
		},
		{
			"foreground": "7979b7",
			"fontStyle": "bold",
			"token": "keyword.operator"
		},
		{
			"foreground": "7979b7",
			"fontStyle": "bold",
			"token": "declaration.function.operator"
		},
		{
			"foreground": "7979b7",
			"fontStyle": "bold",
			"token": "meta.preprocessor.c.include"
		},
		{
			"foreground": "9899c8",
			"token": "keyword.operator.comparison"
		},
		{
			"foreground": "abacd2",
			"background": "3c008033",
			"token": "variable.parameter -variable.parameter.misc.css"
		},
		{
			"foreground": "abacd2",
			"background": "3c008033",
			"token": "meta.definition.method  meta.definition.param-list"
		},
		{
			"foreground": "abacd2",
			"background": "3c008033",
			"token": "meta.function.method.with-arguments variable.parameter.function"
		},
		{
			"foreground": "cdcdcd",
			"background": "333333",
			"token": "meta.doctype"
		},
		{
			"foreground": "cdcdcd",
			"background": "333333",
			"token": "meta.tag.sgml-declaration.doctype"
		},
		{
			"foreground": "cdcdcd",
			"background": "333333",
			"token": "meta.tag.sgml.doctype"
		},
		{
			"foreground": "333333",
			"token": "meta.tag"
		},
		{
			"foreground": "666666",
			"background": "333333bf",
			"token": "meta.tag.structure"
		},
		{
			"foreground": "666666",
			"background": "333333bf",
			"token": "meta.tag.segment"
		},
		{
			"foreground": "4c4c4c",
			"background": "4c4c4c33",
			"token": "meta.tag.block"
		},
		{
			"foreground": "4c4c4c",
			"background": "4c4c4c33",
			"token": "meta.tag.xml"
		},
		{
			"foreground": "4c4c4c",
			"background": "4c4c4c33",
			"token": "meta.tag.key"
		},
		{
			"foreground": "a77d58",
			"background": "803d0033",
			"token": "meta.tag.inline"
		},
		{
			"background": "803d0033",
			"token": "meta.tag.inline source"
		},
		{
			"foreground": "a7595a",
			"background": "80000433",
			"token": "meta.tag.other"
		},
		{
			"foreground": "a7595a",
			"background": "80000433",
			"token": "entity.name.tag.style"
		},
		{
			"foreground": "a7595a",
			"background": "80000433",
			"token": "source entity.other.attribute-name -text.html.basic.embedded"
		},
		{
			"foreground": "a7595a",
			"background": "80000433",
			"token": "entity.name.tag.script"
		},
		{
			"foreground": "a7595a",
			"background": "80000433",
			"token": "meta.tag.block.script"
		},
		{
			"foreground": "5780a6",
			"background": "00438033",
			"token": "meta.tag.form"
		},
		{
			"foreground": "5780a6",
			"background": "00438033",
			"token": "meta.tag.block.form"
		},
		{
			"foreground": "a459a5",
			"background": "3c008033",
			"token": "meta.tag.meta"
		},
		{
			"background": "121212",
			"token": "meta.section.html.head"
		},
		{
			"background": "0043801a",
			"token": "meta.section.html.form"
		},
		{
			"foreground": "666666",
			"token": "meta.tag.xml"
		},
		{
			"foreground": "ffffff4d",
			"token": "entity.name.tag"
		},
		{
			"foreground": "ffffff33",
			"token": "entity.other.attribute-name"
		},
		{
			"foreground": "ffffff33",
			"token": "meta.tag punctuation.definition.string"
		},
		{
			"foreground": "ffffff66",
			"token": "meta.tag string -source -punctuation"
		},
		{
			"foreground": "ffffff66",
			"token": "text source text meta.tag string -punctuation"
		},
		{
			"foreground": "a6a458",
			"background": "33333333",
			"token": "markup markup -(markup meta.paragraph.list)"
		},
		{
			"foreground": "000000",
			"background": "ffffff",
			"token": "markup.hr"
		},
		{
			"foreground": "666666",
			"background": "33333380",
			"token": "markup.heading"
		},
		{
			"fontStyle": "bold",
			"token": "markup.bold"
		},
		{
			"fontStyle": "italic",
			"token": "markup.italic"
		},
		{
			"fontStyle": "underline",
			"token": "markup.underline"
		},
		{
			"foreground": "5780a6",
			"token": "meta.reference"
		},
		{
			"foreground": "5780a6",
			"token": "markup.underline.link"
		},
		{
			"foreground": "56a5a4",
			"background": "00438033",
			"token": "entity.name.reference"
		},
		{
			"foreground": "56a5a4",
			"fontStyle": "underline",
			"token": "meta.reference.list markup.underline.link"
		},
		{
			"foreground": "56a5a4",
			"fontStyle": "underline",
			"token": "text.html.textile markup.underline.link"
		},
		{
			"foreground": "999999",
			"background": "000000",
			"token": "markup.raw.block"
		},
		{
			"background": "ffffff1a",
			"token": "markup.quote"
		},
		{
			"foreground": "666666",
			"background": "00000080",
			"token": "meta.selector"
		},
		{
			"foreground": "575aa6",
			"background": "00048033",
			"token": "meta.attribute-match.css"
		},
		{
			"foreground": "7c58a5",
			"token": "entity.other.attribute-name.pseudo-class"
		},
		{
			"foreground": "7c58a5",
			"token": "entity.other.attribute-name.tag.pseudo-class"
		},
		{
			"foreground": "a459a5",
			"token": "meta.selector entity.other.attribute-name.class"
		},
		{
			"foreground": "a75980",
			"token": "meta.selector entity.other.attribute-name.id"
		},
		{
			"foreground": "a7595a",
			"token": "meta.selector entity.name.tag"
		},
		{
			"foreground": "a77d58",
			"fontStyle": "bold",
			"token": "entity.name.tag.wildcard"
		},
		{
			"foreground": "a77d58",
			"fontStyle": "bold",
			"token": "entity.other.attribute-name.universal"
		},
		{
			"foreground": "333333",
			"fontStyle": "bold",
			"token": "meta.scope.property-list"
		},
		{
			"foreground": "999999",
			"token": "meta.property-name"
		},
		{
			"foreground": "ffffff",
			"background": "000000",
			"token": "support.type.property-name"
		},
		{
			"foreground": "999999",
			"background": "0d0d0d",
			"token": "meta.property-value"
		},
		{
			"background": "000000",
			"token": "text.latex markup.raw"
		},
		{
			"foreground": "bdabd1",
			"token": "text.latex support.function -support.function.textit -support.function.emph"
		},
		{
			"foreground": "ffffffbf",
			"token": "text.latex support.function.section"
		},
		{
			"foreground": "000000",
			"background": "ffffff",
			"token": "text.latex entity.name.section -meta.group -keyword.operator.braces"
		},
		{
			"background": "00000080",
			"token": "text.latex keyword.operator.delimiter"
		},
		{
			"foreground": "999999",
			"token": "text.latex keyword.operator.brackets"
		},
		{
			"foreground": "666666",
			"token": "text.latex keyword.operator.braces"
		},
		{
			"foreground": "0008ff4d",
			"background": "00048033",
			"token": "meta.footnote"
		},
		{
			"background": "ffffff0d",
			"token": "text.latex meta.label.reference"
		},
		{
			"foreground": "a7595a",
			"background": "180d0c",
			"token": "text.latex keyword.control.ref"
		},
		{
			"foreground": "d2beab",
			"background": "291616",
			"token": "text.latex variable.parameter.label.reference"
		},
		{
			"foreground": "a75980",
			"background": "180d12",
			"token": "text.latex keyword.control.cite"
		},
		{
			"foreground": "e8d5de",
			"background": "29161f",
			"token": "variable.parameter.cite"
		},
		{
			"foreground": "ffffff80",
			"token": "text.latex variable.parameter.label"
		},
		{
			"foreground": "33333333",
			"token": "text.latex meta.group.braces"
		},
		{
			"foreground": "33333333",
			"background": "00000080",
			"token": "text.latex meta.environment.list"
		},
		{
			"foreground": "33333333",
			"background": "00000080",
			"token": "text.latex meta.environment.list meta.environment.list"
		},
		{
			"foreground": "33333333",
			"background": "000000",
			"token": "text.latex meta.environment.list meta.environment.list meta.environment.list"
		},
		{
			"foreground": "33333333",
			"token": "text.latex meta.environment.list meta.environment.list meta.environment.list meta.environment.list"
		},
		{
			"foreground": "33333333",
			"token": "text.latex meta.environment.list meta.environment.list meta.environment.list meta.environment.list meta.environment.list"
		},
		{
			"foreground": "33333333",
			"token": "text.latex meta.environment.list meta.environment.list meta.environment.list meta.environment.list meta.environment.list meta.environment.list"
		},
		{
			"foreground": "000000",
			"background": "cdcdcd",
			"token": "text.latex meta.end-document"
		},
		{
			"foreground": "000000",
			"background": "cdcdcd",
			"token": "text.latex meta.begin-document"
		},
		{
			"foreground": "000000",
			"background": "cdcdcd",
			"token": "meta.end-document.latex support.function"
		},
		{
			"foreground": "000000",
			"background": "cdcdcd",
			"token": "meta.end-document.latex variable.parameter"
		},
		{
			"foreground": "000000",
			"background": "cdcdcd",
			"token": "meta.begin-document.latex support.function"
		},
		{
			"foreground": "000000",
			"background": "cdcdcd",
			"token": "meta.begin-document.latex variable.parameter"
		},
		{
			"foreground": "596b61",
			"background": "45815d33",
			"token": "meta.brace.erb.return-value"
		},
		{
			"background": "66666633",
			"token": "source.ruby.rails.embedded.return-value.one-line"
		},
		{
			"foreground": "56a5a4",
			"background": "00fff81a",
			"token": "punctuation.section.embedded -(source string source punctuation.section.embedded)"
		},
		{
			"foreground": "56a5a4",
			"background": "00fff81a",
			"token": "meta.brace.erb.html"
		},
		{
			"background": "00fff81a",
			"token": "source.ruby.rails.embedded.one-line"
		},
		{
			"foreground": "555f69",
			"token": "source string source punctuation.section.embedded"
		},
		{
			"background": "000000",
			"token": "source"
		},
		{
			"background": "000000",
			"token": "meta.brace.erb"
		},
		{
			"foreground": "ffffff",
			"background": "33333380",
			"token": "source string source"
		},
		{
			"foreground": "999999",
			"background": "00000099",
			"token": "source string.interpolated source"
		},
		{
			"background": "3333331a",
			"token": "source.java.embedded"
		},
		{
			"foreground": "ffffff",
			"token": "text -text.xml.strict"
		},
		{
			"foreground": "cccccc",
			"background": "000000",
			"token": "text source"
		},
		{
			"foreground": "cccccc",
			"background": "000000",
			"token": "meta.scope.django.template"
		},
		{
			"foreground": "999999",
			"token": "text string source"
		},
		{
			"foreground": "333333",
			"token": "meta.syntax"
		},
		{
			"foreground": "211211",
			"background": "a7595a",
			"fontStyle": "bold",
			"token": "invalid"
		},
		{
			"foreground": "8f8fc3",
			"background": "0000ff1a",
			"fontStyle": "italic",
			"token": "0comment"
		},
		{
			"foreground": "0000ff1a",
			"fontStyle": "bold",
			"token": "comment punctuation"
		},
		{
			"foreground": "333333",
			"token": "comment"
		},
		{
			"foreground": "262626",
			"background": "8080800d",
			"fontStyle": "bold italic",
			"token": "comment punctuation"
		},
		{
			"fontStyle": "italic",
			"token": "text comment.block -source"
		},
		{
			"foreground": "81bb9e",
			"background": "15281f",
			"token": "markup.inserted"
		},
		{
			"foreground": "bc839f",
			"background": "400021",
			"token": "markup.deleted"
		},
		{
			"foreground": "c3c38f",
			"background": "533f2c",
			"token": "markup.changed"
		},
		{
			"foreground": "ffffff",
			"background": "000000",
			"token": "text.subversion-commit meta.scope.changed-files"
		},
		{
			"foreground": "ffffff",
			"background": "000000",
			"token": "text.subversion-commit meta.scope.changed-files.svn meta.diff.separator"
		},
		{
			"foreground": "000000",
			"background": "ffffff",
			"token": "text.subversion-commit"
		},
		{
			"foreground": "ffffff",
			"background": "ffffff03",
			"fontStyle": "bold",
			"token": "punctuation.terminator"
		},
		{
			"foreground": "ffffff",
			"background": "ffffff03",
			"fontStyle": "bold",
			"token": "meta.delimiter"
		},
		{
			"foreground": "ffffff",
			"background": "ffffff03",
			"fontStyle": "bold",
			"token": "punctuation.separator.method"
		},
		{
			"background": "000000bf",
			"token": "punctuation.terminator.statement"
		},
		{
			"background": "000000bf",
			"token": "meta.delimiter.statement.js"
		},
		{
			"background": "00000040",
			"token": "meta.delimiter.object.js"
		},
		{
			"foreground": "533f2c",
			"fontStyle": "bold",
			"token": "string.quoted.single.brace"
		},
		{
			"foreground": "533f2c",
			"fontStyle": "bold",
			"token": "string.quoted.double.brace"
		},
		{
			"background": "ffffff",
			"token": "text.blog -(text.blog text)"
		},
		{
			"foreground": "666666",
			"background": "ffffff",
			"token": "meta.headers.blog"
		},
		{
			"foreground": "192b2a",
			"background": "00fff81a",
			"token": "meta.headers.blog keyword.other.blog"
		},
		{
			"foreground": "533f2c",
			"background": "ffff551a",
			"token": "meta.headers.blog string.unquoted.blog"
		},
		{
			"foreground": "4c4c4c",
			"background": "33333333",
			"token": "meta.brace.pipe"
		},
		{
			"foreground": "4c4c4c",
			"fontStyle": "bold",
			"token": "meta.brace.erb"
		},
		{
			"foreground": "4c4c4c",
			"fontStyle": "bold",
			"token": "source.ruby.embedded.source.brace"
		},
		{
			"foreground": "4c4c4c",
			"fontStyle": "bold",
			"token": "punctuation.section.dictionary"
		},
		{
			"foreground": "4c4c4c",
			"fontStyle": "bold",
			"token": "punctuation.terminator.dictionary"
		},
		{
			"foreground": "4c4c4c",
			"fontStyle": "bold",
			"token": "punctuation.separator.object"
		},
		{
			"foreground": "ffffff",
			"fontStyle": "bold",
			"token": "meta.group.braces.curly punctuation.section.scope"
		},
		{
			"foreground": "ffffff",
			"fontStyle": "bold",
			"token": "meta.brace.curly"
		},
		{
			"foreground": "345743",
			"fontStyle": "bold",
			"token": "punctuation.separator.objects"
		},
		{
			"foreground": "345743",
			"fontStyle": "bold",
			"token": "meta.group.braces.curly meta.delimiter.object.comma"
		},
		{
			"foreground": "345743",
			"fontStyle": "bold",
			"token": "punctuation.separator.key-value -meta.tag"
		},
		{
			"foreground": "695f55",
			"background": "803d001a",
			"fontStyle": "bold",
			"token": "meta.group.braces.square punctuation.section.scope"
		},
		{
			"foreground": "695f55",
			"background": "803d001a",
			"fontStyle": "bold",
			"token": "meta.group.braces.square meta.delimiter.object.comma"
		},
		{
			"foreground": "695f55",
			"background": "803d001a",
			"fontStyle": "bold",
			"token": "meta.brace.square"
		},
		{
			"foreground": "695f55",
			"background": "803d001a",
			"fontStyle": "bold",
			"token": "punctuation.separator.array"
		},
		{
			"foreground": "695f55",
			"background": "803d001a",
			"fontStyle": "bold",
			"token": "punctuation.section.array"
		},
		{
			"foreground": "cdcdcd",
			"background": "00000080",
			"token": "meta.brace.curly meta.group"
		},
		{
			"foreground": "532d40",
			"fontStyle": "bold",
			"token": "meta.group.braces.round punctuation.section.scope"
		},
		{
			"foreground": "532d40",
			"fontStyle": "bold",
			"token": "meta.group.braces.round meta.delimiter.object.comma"
		},
		{
			"foreground": "532d40",
			"fontStyle": "bold",
			"token": "meta.brace.round"
		},
		{
			"foreground": "abacd2",
			"background": "3c008033",
			"token": "punctuation.section.function"
		},
		{
			"foreground": "abacd2",
			"background": "3c008033",
			"token": "meta.brace.curly.function"
		},
		{
			"foreground": "abacd2",
			"background": "3c008033",
			"token": "meta.function-call punctuation.section.scope.ruby"
		},
		{
			"foreground": "666666",
			"background": "00000080",
			"token": "meta.source.embedded"
		},
		{
			"foreground": "666666",
			"background": "00000080",
			"token": "entity.other.django.tagbraces"
		},
		{
			"background": "0a0a0a",
			"token": "meta.odd-tab.group1"
		},
		{
			"background": "0a0a0a",
			"token": "meta.group.braces"
		},
		{
			"background": "0a0a0a",
			"token": "meta.block.slate"
		},
		{
			"background": "0a0a0a",
			"token": "text.xml.strict meta.tag"
		},
		{
			"background": "0a0a0a",
			"token": "meta.tell-block meta.tell-block"
		},
		{
			"background": "0e0e0e",
			"token": "meta.even-tab.group2"
		},
		{
			"background": "0e0e0e",
			"token": "meta.group.braces meta.group.braces"
		},
		{
			"background": "0e0e0e",
			"token": "meta.block.slate meta.block.slate"
		},
		{
			"background": "0e0e0e",
			"token": "text.xml.strict meta.tag meta.tag"
		},
		{
			"background": "0e0e0e",
			"token": "meta.group.braces meta.group.braces"
		},
		{
			"background": "0e0e0e",
			"token": "meta.tell-block meta.tell-block"
		},
		{
			"background": "111111",
			"token": "meta.odd-tab.group3"
		},
		{
			"background": "111111",
			"token": "meta.group.braces meta.group.braces meta.group.braces"
		},
		{
			"background": "111111",
			"token": "meta.block.slate meta.block.slate meta.block.slate"
		},
		{
			"background": "111111",
			"token": "text.xml.strict meta.tag meta.tag meta.tag"
		},
		{
			"background": "111111",
			"token": "meta.group.braces meta.group.braces meta.group.braces"
		},
		{
			"background": "111111",
			"token": "meta.tell-block meta.tell-block meta.tell-block"
		},
		{
			"background": "151515",
			"token": "meta.even-tab.group4"
		},
		{
			"background": "151515",
			"token": "meta.group.braces meta.group.braces meta.group.braces meta.group.braces"
		},
		{
			"background": "151515",
			"token": "meta.block.slate meta.block.slate meta.block.slate meta.block.slate"
		},
		{
			"background": "151515",
			"token": "text.xml.strict meta.tag meta.tag meta.tag meta.tag"
		},
		{
			"background": "151515",
			"token": "meta.group.braces meta.group.braces meta.group.braces meta.group.braces"
		},
		{
			"background": "151515",
			"token": "meta.tell-block meta.tell-block meta.tell-block meta.tell-block"
		},
		{
			"background": "191919",
			"token": "meta.odd-tab.group5"
		},
		{
			"background": "191919",
			"token": "meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces"
		},
		{
			"background": "191919",
			"token": "meta.block.slate meta.block.slate meta.block.slate meta.block.slate meta.block.slate"
		},
		{
			"background": "191919",
			"token": "text.xml.strict meta.tag meta.tag meta.tag meta.tag meta.tag"
		},
		{
			"background": "191919",
			"token": "meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces"
		},
		{
			"background": "191919",
			"token": "meta.tell-block meta.tell-block meta.tell-block meta.tell-block meta.tell-block"
		},
		{
			"background": "1c1c1c",
			"token": "meta.even-tab.group6"
		},
		{
			"background": "1c1c1c",
			"token": "meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces"
		},
		{
			"background": "1c1c1c",
			"token": "meta.block.slate meta.block.slate meta.block.slate meta.block.slate meta.block.slate meta.block.slate"
		},
		{
			"background": "1c1c1c",
			"token": "text.xml.strict meta.tag meta.tag meta.tag meta.tag meta.tag meta.tag"
		},
		{
			"background": "1c1c1c",
			"token": "meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces"
		},
		{
			"background": "1c1c1c",
			"token": "meta.tell-block meta.tell-block meta.tell-block meta.tell-block meta.tell-block meta.tell-block"
		},
		{
			"background": "1f1f1f",
			"token": "meta.odd-tab.group7"
		},
		{
			"background": "1f1f1f",
			"token": "meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces"
		},
		{
			"background": "1f1f1f",
			"token": "meta.block.slate meta.block.slate meta.block.slate meta.block.slate meta.block.slate meta.block.slate meta.block.slate"
		},
		{
			"background": "1f1f1f",
			"token": "text.xml.strict meta.tag meta.tag meta.tag meta.tag meta.tag meta.tag meta.tag"
		},
		{
			"background": "1f1f1f",
			"token": "meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces"
		},
		{
			"background": "1f1f1f",
			"token": "meta.tell-block meta.tell-block meta.tell-block meta.tell-block meta.tell-block meta.tell-block meta.tell-block"
		},
		{
			"background": "212121",
			"token": "meta.even-tab.group8"
		},
		{
			"background": "212121",
			"token": "meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces"
		},
		{
			"background": "212121",
			"token": "meta.block.slate meta.block.slate meta.block.slate meta.block.slate meta.block.slate meta.block.slate meta.block.slate meta.block.slate"
		},
		{
			"background": "212121",
			"token": "text.xml.strict meta.tag meta.tag meta.tag meta.tag meta.tag meta.tag meta.tag meta.tag"
		},
		{
			"background": "212121",
			"token": "meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces"
		},
		{
			"background": "212121",
			"token": "meta.tell-block meta.tell-block meta.tell-block meta.tell-block meta.tell-block meta.tell-block meta.tell-block meta.tell-block"
		},
		{
			"background": "242424",
			"token": "meta.odd-tab.group11"
		},
		{
			"background": "242424",
			"token": "meta.odd-tab.group10"
		},
		{
			"background": "242424",
			"token": "meta.odd-tab.group9"
		},
		{
			"background": "242424",
			"token": "meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces"
		},
		{
			"background": "242424",
			"token": "meta.block.slate meta.block.slate meta.block.slate meta.block.slate meta.block.slate meta.block.slate meta.block.slate meta.block.slate meta.block.slate"
		},
		{
			"background": "242424",
			"token": "text.xml.strict meta.tag meta.tag meta.tag meta.tag meta.tag meta.tag meta.tag meta.tag meta.tag"
		},
		{
			"background": "242424",
			"token": "meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces"
		},
		{
			"background": "242424",
			"token": "meta.tell-block meta.tell-block meta.tell-block meta.tell-block meta.tell-block meta.tell-block meta.tell-block meta.tell-block meta.tell-block"
		},
		{
			"foreground": "666666",
			"token": "meta.block.slate"
		},
		{
			"foreground": "cdcdcd",
			"token": "meta.block.content.slate"
		}
	],
	"colors": {
		"editor.foreground": "#CDCDCD",
		"editor.background": "#050505FA",
		"editor.selectionBackground": "#2E2EE64D",
		"editor.lineHighlightBackground": "#0000801A",
		"editorCursor.foreground": "#7979B7",
		"editorWhitespace.foreground": "#CDCDCD1A"
	}
} as Monaco.editor.IStandaloneThemeData

let chromeDevTools = {
	"base": "vs",
	"inherit": true,
	"rules": [
		{
			"background": "FFFFFF",
			"token": ""
		},
		{
			"foreground": "c41a16",
			"token": "string"
		},
		{
			"foreground": "1c00cf",
			"token": "constant.numeric"
		},
		{
			"foreground": "aa0d91",
			"token": "keyword"
		},
		{
			"foreground": "000000",
			"token": "keyword.operator"
		},
		{
			"foreground": "aa0d91",
			"token": "constant.language"
		},
		{
			"foreground": "990000",
			"token": "support.class.exception"
		},
		{
			"foreground": "000000",
			"token": "entity.name.function"
		},
		{
			"fontStyle": "bold underline",
			"token": "entity.name.type"
		},
		{
			"fontStyle": "italic",
			"token": "variable.parameter"
		},
		{
			"foreground": "007400",
			"token": "comment"
		},
		{
			"foreground": "ff0000",
			"token": "invalid"
		},
		{
			"background": "e71a1100",
			"token": "invalid.deprecated.trailing-whitespace"
		},
		{
			"foreground": "000000",
			"background": "fafafafc",
			"token": "text source"
		},
		{
			"foreground": "aa0d91",
			"token": "meta.tag"
		},
		{
			"foreground": "aa0d91",
			"token": "declaration.tag"
		},
		{
			"foreground": "000000",
			"fontStyle": "bold",
			"token": "support"
		},
		{
			"foreground": "aa0d91",
			"token": "storage"
		},
		{
			"fontStyle": "bold underline",
			"token": "entity.name.section"
		},
		{
			"foreground": "000000",
			"fontStyle": "bold",
			"token": "entity.name.function.frame"
		},
		{
			"foreground": "333333",
			"token": "meta.tag.preprocessor.xml"
		},
		{
			"foreground": "994500",
			"fontStyle": "italic",
			"token": "entity.other.attribute-name"
		},
		{
			"foreground": "881280",
			"token": "entity.name.tag"
		}
	],
	"colors": {
		"editor.foreground": "#000000",
		"editor.background": "#FFFFFF",
		"editor.selectionBackground": "#BAD6FD",
		"editor.lineHighlightBackground": "#0000001A",
		"editorCursor.foreground": "#000000",
		"editorWhitespace.foreground": "#B3B3B3F4"
	}
} as Monaco.editor.IStandaloneThemeData

let cloudsMidnight = {
	"base": "vs-dark",
	"inherit": true,
	"rules": [
		{
			"background": "191919",
			"token": ""
		},
		{
			"foreground": "3c403b",
			"token": "comment"
		},
		{
			"foreground": "5d90cd",
			"token": "string"
		},
		{
			"foreground": "46a609",
			"token": "constant.numeric"
		},
		{
			"foreground": "39946a",
			"token": "constant.language"
		},
		{
			"foreground": "927c5d",
			"token": "keyword"
		},
		{
			"foreground": "927c5d",
			"token": "support.constant.property-value"
		},
		{
			"foreground": "927c5d",
			"token": "constant.other.color"
		},
		{
			"foreground": "366f1a",
			"token": "keyword.other.unit"
		},
		{
			"foreground": "a46763",
			"token": "entity.other.attribute-name.html"
		},
		{
			"foreground": "4b4b4b",
			"token": "keyword.operator"
		},
		{
			"foreground": "e92e2e",
			"token": "storage"
		},
		{
			"foreground": "858585",
			"token": "entity.other.inherited-class"
		},
		{
			"foreground": "606060",
			"token": "entity.name.tag"
		},
		{
			"foreground": "a165ac",
			"token": "constant.character.entity"
		},
		{
			"foreground": "a165ac",
			"token": "support.class.js"
		},
		{
			"foreground": "606060",
			"token": "entity.other.attribute-name"
		},
		{
			"foreground": "e92e2e",
			"token": "meta.selector.css"
		},
		{
			"foreground": "e92e2e",
			"token": "entity.name.tag.css"
		},
		{
			"foreground": "e92e2e",
			"token": "entity.other.attribute-name.id.css"
		},
		{
			"foreground": "e92e2e",
			"token": "entity.other.attribute-name.class.css"
		},
		{
			"foreground": "616161",
			"token": "meta.property-name.css"
		},
		{
			"foreground": "e92e2e",
			"token": "support.function"
		},
		{
			"foreground": "ffffff",
			"background": "e92e2e",
			"token": "invalid"
		},
		{
			"foreground": "e92e2e",
			"token": "punctuation.section.embedded"
		},
		{
			"foreground": "606060",
			"token": "punctuation.definition.tag"
		},
		{
			"foreground": "a165ac",
			"token": "constant.other.color.rgb-value.css"
		},
		{
			"foreground": "a165ac",
			"token": "support.constant.property-value.css"
		}
	],
	"colors": {
		"editor.foreground": "#929292",
		"editor.background": "#191919",
		"editor.selectionBackground": "#000000",
		"editor.lineHighlightBackground": "#D7D7D708",
		"editorCursor.foreground": "#7DA5DC",
		"editorWhitespace.foreground": "#BFBFBF"
	}
} as Monaco.editor.IStandaloneThemeData

let clouds = {
	"base": "vs",
	"inherit": true,
	"rules": [
		{
			"background": "FFFFFF",
			"token": ""
		},
		{
			"foreground": "bcc8ba",
			"token": "comment"
		},
		{
			"foreground": "5d90cd",
			"token": "string"
		},
		{
			"foreground": "46a609",
			"token": "constant.numeric"
		},
		{
			"foreground": "39946a",
			"token": "constant.language"
		},
		{
			"foreground": "af956f",
			"token": "keyword"
		},
		{
			"foreground": "af956f",
			"token": "support.constant.property-value"
		},
		{
			"foreground": "af956f",
			"token": "constant.other.color"
		},
		{
			"foreground": "96dc5f",
			"token": "keyword.other.unit"
		},
		{
			"foreground": "484848",
			"token": "keyword.operator"
		},
		{
			"foreground": "c52727",
			"token": "storage"
		},
		{
			"foreground": "858585",
			"token": "entity.other.inherited-class"
		},
		{
			"foreground": "606060",
			"token": "entity.name.tag"
		},
		{
			"foreground": "bf78cc",
			"token": "constant.character.entity"
		},
		{
			"foreground": "bf78cc",
			"token": "support.class.js"
		},
		{
			"foreground": "606060",
			"token": "entity.other.attribute-name"
		},
		{
			"foreground": "c52727",
			"token": "meta.selector.css"
		},
		{
			"foreground": "c52727",
			"token": "entity.name.tag.css"
		},
		{
			"foreground": "c52727",
			"token": "entity.other.attribute-name.id.css"
		},
		{
			"foreground": "c52727",
			"token": "entity.other.attribute-name.class.css"
		},
		{
			"foreground": "484848",
			"token": "meta.property-name.css"
		},
		{
			"foreground": "c52727",
			"token": "support.function"
		},
		{
			"background": "ff002a",
			"token": "invalid"
		},
		{
			"foreground": "c52727",
			"token": "punctuation.section.embedded"
		},
		{
			"foreground": "606060",
			"token": "punctuation.definition.tag"
		},
		{
			"foreground": "bf78cc",
			"token": "constant.other.color.rgb-value.css"
		},
		{
			"foreground": "bf78cc",
			"token": "support.constant.property-value.css"
		}
	],
	"colors": {
		"editor.foreground": "#000000",
		"editor.background": "#FFFFFF",
		"editor.selectionBackground": "#BDD5FC",
		"editor.lineHighlightBackground": "#FFFBD1",
		"editorCursor.foreground": "#000000",
		"editorWhitespace.foreground": "#BFBFBF"
	}
} as Monaco.editor.IStandaloneThemeData

let cobalt = {
	"base": "vs-dark",
	"inherit": true,
	"rules": [
		{
			"background": "002240",
			"token": ""
		},
		{
			"foreground": "e1efff",
			"token": "punctuation - (punctuation.definition.string || punctuation.definition.comment)"
		},
		{
			"foreground": "ff628c",
			"token": "constant"
		},
		{
			"foreground": "ffdd00",
			"token": "entity"
		},
		{
			"foreground": "ff9d00",
			"token": "keyword"
		},
		{
			"foreground": "ffee80",
			"token": "storage"
		},
		{
			"foreground": "3ad900",
			"token": "string -string.unquoted.old-plist -string.unquoted.heredoc"
		},
		{
			"foreground": "3ad900",
			"token": "string.unquoted.heredoc string"
		},
		{
			"foreground": "0088ff",
			"fontStyle": "italic",
			"token": "comment"
		},
		{
			"foreground": "80ffbb",
			"token": "support"
		},
		{
			"foreground": "cccccc",
			"token": "variable"
		},
		{
			"foreground": "ff80e1",
			"token": "variable.language"
		},
		{
			"foreground": "ffee80",
			"token": "meta.function-call"
		},
		{
			"foreground": "f8f8f8",
			"background": "800f00",
			"token": "invalid"
		},
		{
			"foreground": "ffffff",
			"background": "223545",
			"token": "text source"
		},
		{
			"foreground": "ffffff",
			"background": "223545",
			"token": "string.unquoted.heredoc"
		},
		{
			"foreground": "ffffff",
			"background": "223545",
			"token": "source source"
		},
		{
			"foreground": "80fcff",
			"fontStyle": "italic",
			"token": "entity.other.inherited-class"
		},
		{
			"foreground": "9eff80",
			"token": "string.quoted source"
		},
		{
			"foreground": "80ff82",
			"token": "string constant"
		},
		{
			"foreground": "80ffc2",
			"token": "string.regexp"
		},
		{
			"foreground": "edef7d",
			"token": "string variable"
		},
		{
			"foreground": "ffb054",
			"token": "support.function"
		},
		{
			"foreground": "eb939a",
			"token": "support.constant"
		},
		{
			"foreground": "ff1e00",
			"token": "support.type.exception"
		},
		{
			"foreground": "8996a8",
			"token": "meta.preprocessor.c"
		},
		{
			"foreground": "afc4db",
			"token": "meta.preprocessor.c keyword"
		},
		{
			"foreground": "73817d",
			"token": "meta.sgml.html meta.doctype"
		},
		{
			"foreground": "73817d",
			"token": "meta.sgml.html meta.doctype entity"
		},
		{
			"foreground": "73817d",
			"token": "meta.sgml.html meta.doctype string"
		},
		{
			"foreground": "73817d",
			"token": "meta.xml-processing"
		},
		{
			"foreground": "73817d",
			"token": "meta.xml-processing entity"
		},
		{
			"foreground": "73817d",
			"token": "meta.xml-processing string"
		},
		{
			"foreground": "9effff",
			"token": "meta.tag"
		},
		{
			"foreground": "9effff",
			"token": "meta.tag entity"
		},
		{
			"foreground": "9effff",
			"token": "meta.selector.css entity.name.tag"
		},
		{
			"foreground": "ffb454",
			"token": "meta.selector.css entity.other.attribute-name.id"
		},
		{
			"foreground": "5fe461",
			"token": "meta.selector.css entity.other.attribute-name.class"
		},
		{
			"foreground": "9df39f",
			"token": "support.type.property-name.css"
		},
		{
			"foreground": "f6f080",
			"token": "meta.property-group support.constant.property-value.css"
		},
		{
			"foreground": "f6f080",
			"token": "meta.property-value support.constant.property-value.css"
		},
		{
			"foreground": "f6aa11",
			"token": "meta.preprocessor.at-rule keyword.control.at-rule"
		},
		{
			"foreground": "edf080",
			"token": "meta.property-value support.constant.named-color.css"
		},
		{
			"foreground": "edf080",
			"token": "meta.property-value constant"
		},
		{
			"foreground": "eb939a",
			"token": "meta.constructor.argument.css"
		},
		{
			"foreground": "f8f8f8",
			"background": "000e1a",
			"token": "meta.diff"
		},
		{
			"foreground": "f8f8f8",
			"background": "000e1a",
			"token": "meta.diff.header"
		},
		{
			"foreground": "f8f8f8",
			"background": "4c0900",
			"token": "markup.deleted"
		},
		{
			"foreground": "f8f8f8",
			"background": "806f00",
			"token": "markup.changed"
		},
		{
			"foreground": "f8f8f8",
			"background": "154f00",
			"token": "markup.inserted"
		},
		{
			"background": "8fddf630",
			"token": "markup.raw"
		},
		{
			"background": "004480",
			"token": "markup.quote"
		},
		{
			"background": "130d26",
			"token": "markup.list"
		},
		{
			"foreground": "c1afff",
			"fontStyle": "bold",
			"token": "markup.bold"
		},
		{
			"foreground": "b8ffd9",
			"fontStyle": "italic",
			"token": "markup.italic"
		},
		{
			"foreground": "c8e4fd",
			"background": "001221",
			"fontStyle": "bold",
			"token": "markup.heading"
		}
	],
	"colors": {
		"editor.foreground": "#FFFFFF",
		"editor.background": "#002240",
		"editor.selectionBackground": "#B36539BF",
		"editor.lineHighlightBackground": "#00000059",
		"editorCursor.foreground": "#FFFFFF",
		"editorWhitespace.foreground": "#FFFFFF26"
	}
} as Monaco.editor.IStandaloneThemeData

let dracula = {
	"base": "vs-dark",
	"inherit": true,
	"rules": [
		{
			"background": "282a36",
			"token": ""
		},
		{
			"foreground": "6272a4",
			"token": "comment"
		},
		{
			"foreground": "f1fa8c",
			"token": "string"
		},
		{
			"foreground": "bd93f9",
			"token": "constant.numeric"
		},
		{
			"foreground": "bd93f9",
			"token": "constant.language"
		},
		{
			"foreground": "bd93f9",
			"token": "constant.character"
		},
		{
			"foreground": "bd93f9",
			"token": "constant.other"
		},
		{
			"foreground": "ffb86c",
			"token": "variable.other.readwrite.instance"
		},
		{
			"foreground": "ff79c6",
			"token": "constant.character.escaped"
		},
		{
			"foreground": "ff79c6",
			"token": "constant.character.escape"
		},
		{
			"foreground": "ff79c6",
			"token": "string source"
		},
		{
			"foreground": "ff79c6",
			"token": "string source.ruby"
		},
		{
			"foreground": "ff79c6",
			"token": "keyword"
		},
		{
			"foreground": "ff79c6",
			"token": "storage"
		},
		{
			"foreground": "8be9fd",
			"fontStyle": "italic",
			"token": "storage.type"
		},
		{
			"foreground": "50fa7b",
			"fontStyle": "underline",
			"token": "entity.name.class"
		},
		{
			"foreground": "50fa7b",
			"fontStyle": "italic underline",
			"token": "entity.other.inherited-class"
		},
		{
			"foreground": "50fa7b",
			"token": "entity.name.function"
		},
		{
			"foreground": "ffb86c",
			"fontStyle": "italic",
			"token": "variable.parameter"
		},
		{
			"foreground": "ff79c6",
			"token": "entity.name.tag"
		},
		{
			"foreground": "50fa7b",
			"token": "entity.other.attribute-name"
		},
		{
			"foreground": "8be9fd",
			"token": "support.function"
		},
		{
			"foreground": "6be5fd",
			"token": "support.constant"
		},
		{
			"foreground": "66d9ef",
			"fontStyle": " italic",
			"token": "support.type"
		},
		{
			"foreground": "66d9ef",
			"fontStyle": " italic",
			"token": "support.class"
		},
		{
			"foreground": "f8f8f0",
			"background": "ff79c6",
			"token": "invalid"
		},
		{
			"foreground": "f8f8f0",
			"background": "bd93f9",
			"token": "invalid.deprecated"
		},
		{
			"foreground": "cfcfc2",
			"token": "meta.structure.dictionary.json string.quoted.double.json"
		},
		{
			"foreground": "6272a4",
			"token": "meta.diff"
		},
		{
			"foreground": "6272a4",
			"token": "meta.diff.header"
		},
		{
			"foreground": "ff79c6",
			"token": "markup.deleted"
		},
		{
			"foreground": "50fa7b",
			"token": "markup.inserted"
		},
		{
			"foreground": "e6db74",
			"token": "markup.changed"
		},
		{
			"foreground": "bd93f9",
			"token": "constant.numeric.line-number.find-in-files - match"
		},
		{
			"foreground": "e6db74",
			"token": "entity.name.filename"
		},
		{
			"foreground": "f83333",
			"token": "message.error"
		},
		{
			"foreground": "eeeeee",
			"token": "punctuation.definition.string.begin.json - meta.structure.dictionary.value.json"
		},
		{
			"foreground": "eeeeee",
			"token": "punctuation.definition.string.end.json - meta.structure.dictionary.value.json"
		},
		{
			"foreground": "8be9fd",
			"token": "meta.structure.dictionary.json string.quoted.double.json"
		},
		{
			"foreground": "f1fa8c",
			"token": "meta.structure.dictionary.value.json string.quoted.double.json"
		},
		{
			"foreground": "50fa7b",
			"token": "meta meta meta meta meta meta meta.structure.dictionary.value string"
		},
		{
			"foreground": "ffb86c",
			"token": "meta meta meta meta meta meta.structure.dictionary.value string"
		},
		{
			"foreground": "ff79c6",
			"token": "meta meta meta meta meta.structure.dictionary.value string"
		},
		{
			"foreground": "bd93f9",
			"token": "meta meta meta meta.structure.dictionary.value string"
		},
		{
			"foreground": "50fa7b",
			"token": "meta meta meta.structure.dictionary.value string"
		},
		{
			"foreground": "ffb86c",
			"token": "meta meta.structure.dictionary.value string"
		}
	],
	"colors": {
		"editor.foreground": "#f8f8f2",
		"editor.background": "#282a36",
		"editor.selectionBackground": "#44475a",
		"editor.lineHighlightBackground": "#44475a",
		"editorCursor.foreground": "#f8f8f0",
		"editorWhitespace.foreground": "#3B3A32",
		"editorIndentGuide.activeBackground": "#9D550FB0",
		"editor.selectionHighlightBorder": "#222218"
	}
} as Monaco.editor.IStandaloneThemeData

let dreamweaver = {
	"base": "vs",
	"inherit": true,
	"rules": [
		{
			"background": "FFFFFF",
			"token": ""
		},
		{
			"foreground": "000000",
			"token": "text"
		},
		{
			"foreground": "ee000b",
			"token": "constant.numeric - source.css"
		},
		{
			"foreground": "9a9a9a",
			"token": "comment"
		},
		{
			"foreground": "00359e",
			"token": "text.html meta.tag"
		},
		{
			"foreground": "001eff",
			"token": "text.html.basic meta.tag string.quoted - source"
		},
		{
			"foreground": "000000",
			"fontStyle": "bold",
			"token": "text.html.basic constant.character.entity.html"
		},
		{
			"foreground": "106800",
			"token": "text.html meta.tag.a - string"
		},
		{
			"foreground": "6d232e",
			"token": "text.html meta.tag.img - string"
		},
		{
			"foreground": "ff9700",
			"token": "text.html meta.tag.form - string"
		},
		{
			"foreground": "009079",
			"token": "text.html meta.tag.table - string"
		},
		{
			"foreground": "842b44",
			"token": "source.js.embedded.html punctuation.definition.tag - source.php"
		},
		{
			"foreground": "842b44",
			"token": "source.js.embedded.html entity.name.tag.script"
		},
		{
			"foreground": "842b44",
			"token": "source.js.embedded entity.other.attribute-name - source.js string"
		},
		{
			"foreground": "9a9a9a",
			"token": "source.js comment - source.php"
		},
		{
			"foreground": "000000",
			"token": "source.js meta.function - source.php"
		},
		{
			"foreground": "24c696",
			"token": "source.js meta.class - source.php"
		},
		{
			"foreground": "24c696",
			"token": "source.js support.function - source.php"
		},
		{
			"foreground": "0035ff",
			"token": "source.js string - source.php"
		},
		{
			"foreground": "0035ff",
			"token": "source.js keyword.operator"
		},
		{
			"foreground": "7e00b7",
			"token": "source.js support.class"
		},
		{
			"foreground": "000000",
			"fontStyle": "bold",
			"token": "source.js storage"
		},
		{
			"foreground": "05208c",
			"fontStyle": "bold",
			"token": "source.js storage - storage.type.function - source.php"
		},
		{
			"foreground": "05208c",
			"fontStyle": "bold",
			"token": "source.js constant - source.php"
		},
		{
			"foreground": "05208c",
			"fontStyle": "bold",
			"token": "source.js keyword - source.php"
		},
		{
			"foreground": "05208c",
			"fontStyle": "bold",
			"token": "source.js variable.language"
		},
		{
			"foreground": "05208c",
			"fontStyle": "bold",
			"token": "source.js meta.brace"
		},
		{
			"foreground": "05208c",
			"fontStyle": "bold",
			"token": "source.js punctuation.definition.parameters.begin"
		},
		{
			"foreground": "05208c",
			"fontStyle": "bold",
			"token": "source.js punctuation.definition.parameters.end"
		},
		{
			"foreground": "106800",
			"token": "source.js string.regexp"
		},
		{
			"foreground": "106800",
			"token": "source.js string.regexp constant"
		},
		{
			"foreground": "8d00b7",
			"token": "source.css.embedded.html punctuation.definition.tag"
		},
		{
			"foreground": "8d00b7",
			"token": "source.css.embedded.html entity.name.tag.style"
		},
		{
			"foreground": "8d00b7",
			"token": "source.css.embedded entity.other.attribute-name - meta.selector"
		},
		{
			"foreground": "009c7f",
			"fontStyle": "bold",
			"token": "source.css meta.at-rule.import.css"
		},
		{
			"foreground": "ee000b",
			"fontStyle": "bold",
			"token": "source.css keyword.other.important"
		},
		{
			"foreground": "430303",
			"fontStyle": "bold",
			"token": "source.css meta.at-rule.media"
		},
		{
			"foreground": "106800",
			"token": "source.css string"
		},
		{
			"foreground": "da29ff",
			"token": "source.css meta.selector"
		},
		{
			"foreground": "da29ff",
			"token": "source.css meta.property-list"
		},
		{
			"foreground": "da29ff",
			"token": "source.css meta.at-rule"
		},
		{
			"foreground": "da29ff",
			"fontStyle": "bold",
			"token": "source.css punctuation.separator - source.php"
		},
		{
			"foreground": "da29ff",
			"fontStyle": "bold",
			"token": "source.css punctuation.terminator - source.php"
		},
		{
			"foreground": "05208c",
			"token": "source.css meta.property-name"
		},
		{
			"foreground": "0035ff",
			"token": "source.css meta.property-value"
		},
		{
			"foreground": "ee000b",
			"fontStyle": "bold",
			"token": "source.php punctuation.section.embedded.begin"
		},
		{
			"foreground": "ee000b",
			"fontStyle": "bold",
			"token": "source.php punctuation.section.embedded.end"
		},
		{
			"foreground": "000000",
			"token": "source.php - punctuation.section"
		},
		{
			"foreground": "000000",
			"token": "source.php variable"
		},
		{
			"foreground": "000000",
			"token": "source.php meta.function.arguments"
		},
		{
			"foreground": "05208c",
			"token": "source.php punctuation - string - variable - meta.function"
		},
		{
			"foreground": "24bf96",
			"token": "source.php storage.type"
		},
		{
			"foreground": "009714",
			"token": "source.php keyword - comment"
		},
		{
			"foreground": "009714",
			"token": "source.php storage.type.class"
		},
		{
			"foreground": "009714",
			"token": "source.php storage.type.interface"
		},
		{
			"foreground": "009714",
			"token": "source.php storage.modifier"
		},
		{
			"foreground": "009714",
			"token": "source.php constant.language"
		},
		{
			"foreground": "0035ff",
			"token": "source.php support"
		},
		{
			"foreground": "0035ff",
			"token": "source.php storage"
		},
		{
			"foreground": "0035ff",
			"token": "source.php keyword.operator"
		},
		{
			"foreground": "0035ff",
			"token": "source.php storage.type.function"
		},
		{
			"foreground": "0092f2",
			"token": "source.php variable.other.global"
		},
		{
			"foreground": "551d02",
			"token": "source.php support.constant"
		},
		{
			"foreground": "551d02",
			"token": "source.php constant.language.php"
		},
		{
			"foreground": "e20000",
			"token": "source.php string"
		},
		{
			"foreground": "e20000",
			"token": "source.php string keyword.operator"
		},
		{
			"foreground": "ff6200",
			"token": "source.php string.quoted.double variable"
		},
		{
			"foreground": "ff9404",
			"token": "source.php comment"
		},
		{
			"foreground": "ee000b",
			"background": "efff8a",
			"fontStyle": "bold",
			"token": "invalid"
		}
	],
	"colors": {
		"editor.foreground": "#000000",
		"editor.background": "#FFFFFF",
		"editor.selectionBackground": "#5EA0FF",
		"editor.lineHighlightBackground": "#00000012",
		"editorCursor.foreground": "#000000",
		"editorWhitespace.foreground": "#BFBFBF"
	}
} as Monaco.editor.IStandaloneThemeData

let espressoLibre = {
	"base": "vs-dark",
	"inherit": true,
	"rules": [
		{
			"background": "2A211C",
			"token": ""
		},
		{
			"foreground": "0066ff",
			"fontStyle": "italic",
			"token": "comment"
		},
		{
			"foreground": "43a8ed",
			"fontStyle": "bold",
			"token": "keyword"
		},
		{
			"foreground": "43a8ed",
			"fontStyle": "bold",
			"token": "storage"
		},
		{
			"foreground": "44aa43",
			"token": "constant.numeric"
		},
		{
			"foreground": "c5656b",
			"fontStyle": "bold",
			"token": "constant"
		},
		{
			"foreground": "585cf6",
			"fontStyle": "bold",
			"token": "constant.language"
		},
		{
			"foreground": "318495",
			"token": "variable.language"
		},
		{
			"foreground": "318495",
			"token": "variable.other"
		},
		{
			"foreground": "049b0a",
			"token": "string"
		},
		{
			"foreground": "2fe420",
			"token": "constant.character.escape"
		},
		{
			"foreground": "2fe420",
			"token": "string source"
		},
		{
			"foreground": "1a921c",
			"token": "meta.preprocessor"
		},
		{
			"foreground": "9aff87",
			"fontStyle": "bold",
			"token": "keyword.control.import"
		},
		{
			"foreground": "ff9358",
			"fontStyle": "bold",
			"token": "entity.name.function"
		},
		{
			"foreground": "ff9358",
			"fontStyle": "bold",
			"token": "keyword.other.name-of-parameter.objc"
		},
		{
			"fontStyle": "underline",
			"token": "entity.name.type"
		},
		{
			"fontStyle": "italic",
			"token": "entity.other.inherited-class"
		},
		{
			"fontStyle": "italic",
			"token": "variable.parameter"
		},
		{
			"foreground": "8b8e9c",
			"token": "storage.type.method"
		},
		{
			"fontStyle": "italic",
			"token": "meta.section entity.name.section"
		},
		{
			"fontStyle": "italic",
			"token": "declaration.section entity.name.section"
		},
		{
			"foreground": "7290d9",
			"fontStyle": "bold",
			"token": "support.function"
		},
		{
			"foreground": "6d79de",
			"fontStyle": "bold",
			"token": "support.class"
		},
		{
			"foreground": "6d79de",
			"fontStyle": "bold",
			"token": "support.type"
		},
		{
			"foreground": "00af0e",
			"fontStyle": "bold",
			"token": "support.constant"
		},
		{
			"foreground": "2f5fe0",
			"fontStyle": "bold",
			"token": "support.variable"
		},
		{
			"foreground": "687687",
			"token": "keyword.operator.js"
		},
		{
			"foreground": "ffffff",
			"background": "990000",
			"token": "invalid"
		},
		{
			"background": "ffd0d0",
			"token": "invalid.deprecated.trailing-whitespace"
		},
		{
			"background": "f5aa7730",
			"token": "text source"
		},
		{
			"background": "f5aa7730",
			"token": "string.unquoted"
		},
		{
			"foreground": "8f7e65",
			"token": "meta.tag.preprocessor.xml"
		},
		{
			"foreground": "888888",
			"token": "meta.tag.sgml.doctype"
		},
		{
			"fontStyle": "italic",
			"token": "string.quoted.docinfo.doctype.DTD"
		},
		{
			"foreground": "43a8ed",
			"token": "meta.tag"
		},
		{
			"foreground": "43a8ed",
			"token": "declaration.tag"
		},
		{
			"fontStyle": "bold",
			"token": "entity.name.tag"
		},
		{
			"fontStyle": "italic",
			"token": "entity.other.attribute-name"
		}
	],
	"colors": {
		"editor.foreground": "#BDAE9D",
		"editor.background": "#2A211C",
		"editor.selectionBackground": "#C3DCFF",
		"editor.lineHighlightBackground": "#3A312C",
		"editorCursor.foreground": "#889AFF",
		"editorWhitespace.foreground": "#BFBFBF"
	}
} as Monaco.editor.IStandaloneThemeData

let githubDark = {
	"base": "vs-dark",
	"inherit": true,
	"rules": [
		{
			"background": "24292e",
			"token": ""
		},
		{
			"foreground": "959da5",
			"token": "comment"
		},
		{
			"foreground": "959da5",
			"token": "punctuation.definition.comment"
		},
		{
			"foreground": "959da5",
			"token": "string.comment"
		},
		{
			"foreground": "c8e1ff",
			"token": "constant"
		},
		{
			"foreground": "c8e1ff",
			"token": "entity.name.constant"
		},
		{
			"foreground": "c8e1ff",
			"token": "variable.other.constant"
		},
		{
			"foreground": "c8e1ff",
			"token": "variable.language"
		},
		{
			"foreground": "b392f0",
			"token": "entity"
		},
		{
			"foreground": "b392f0",
			"token": "entity.name"
		},
		{
			"foreground": "f6f8fa",
			"token": "variable.parameter.function"
		},
		{
			"foreground": "7bcc72",
			"token": "entity.name.tag"
		},
		{
			"foreground": "ea4a5a",
			"token": "keyword"
		},
		{
			"foreground": "ea4a5a",
			"token": "storage"
		},
		{
			"foreground": "ea4a5a",
			"token": "storage.type"
		},
		{
			"foreground": "f6f8fa",
			"token": "storage.modifier.package"
		},
		{
			"foreground": "f6f8fa",
			"token": "storage.modifier.import"
		},
		{
			"foreground": "f6f8fa",
			"token": "storage.type.java"
		},
		{
			"foreground": "79b8ff",
			"token": "string"
		},
		{
			"foreground": "79b8ff",
			"token": "punctuation.definition.string"
		},
		{
			"foreground": "79b8ff",
			"token": "string punctuation.section.embedded source"
		},
		{
			"foreground": "c8e1ff",
			"token": "support"
		},
		{
			"foreground": "c8e1ff",
			"token": "meta.property-name"
		},
		{
			"foreground": "fb8532",
			"token": "variable"
		},
		{
			"foreground": "f6f8fa",
			"token": "variable.other"
		},
		{
			"foreground": "d73a49",
			"fontStyle": "bold italic underline",
			"token": "invalid.broken"
		},
		{
			"foreground": "d73a49",
			"fontStyle": "bold italic underline",
			"token": "invalid.deprecated"
		},
		{
			"foreground": "fafbfc",
			"background": "d73a49",
			"fontStyle": "italic underline",
			"token": "invalid.illegal"
		},
		{
			"foreground": "fafbfc",
			"background": "d73a49",
			"fontStyle": "italic underline",
			"token": "carriage-return"
		},
		{
			"foreground": "d73a49",
			"fontStyle": "bold italic underline",
			"token": "invalid.unimplemented"
		},
		{
			"foreground": "d73a49",
			"token": "message.error"
		},
		{
			"foreground": "f6f8fa",
			"token": "string source"
		},
		{
			"foreground": "c8e1ff",
			"token": "string variable"
		},
		{
			"foreground": "79b8ff",
			"token": "source.regexp"
		},
		{
			"foreground": "79b8ff",
			"token": "string.regexp"
		},
		{
			"foreground": "79b8ff",
			"token": "string.regexp.character-class"
		},
		{
			"foreground": "79b8ff",
			"token": "string.regexp constant.character.escape"
		},
		{
			"foreground": "79b8ff",
			"token": "string.regexp source.ruby.embedded"
		},
		{
			"foreground": "79b8ff",
			"token": "string.regexp string.regexp.arbitrary-repitition"
		},
		{
			"foreground": "7bcc72",
			"fontStyle": "bold",
			"token": "string.regexp constant.character.escape"
		},
		{
			"foreground": "c8e1ff",
			"token": "support.constant"
		},
		{
			"foreground": "c8e1ff",
			"token": "support.variable"
		},
		{
			"foreground": "c8e1ff",
			"token": "meta.module-reference"
		},
		{
			"foreground": "fb8532",
			"token": "markup.list"
		},
		{
			"foreground": "0366d6",
			"fontStyle": "bold",
			"token": "markup.heading"
		},
		{
			"foreground": "0366d6",
			"fontStyle": "bold",
			"token": "markup.heading entity.name"
		},
		{
			"foreground": "c8e1ff",
			"token": "markup.quote"
		},
		{
			"foreground": "f6f8fa",
			"fontStyle": "italic",
			"token": "markup.italic"
		},
		{
			"foreground": "f6f8fa",
			"fontStyle": "bold",
			"token": "markup.bold"
		},
		{
			"foreground": "c8e1ff",
			"token": "markup.raw"
		},
		{
			"foreground": "b31d28",
			"background": "ffeef0",
			"token": "markup.deleted"
		},
		{
			"foreground": "b31d28",
			"background": "ffeef0",
			"token": "meta.diff.header.from-file"
		},
		{
			"foreground": "b31d28",
			"background": "ffeef0",
			"token": "punctuation.definition.deleted"
		},
		{
			"foreground": "176f2c",
			"background": "f0fff4",
			"token": "markup.inserted"
		},
		{
			"foreground": "176f2c",
			"background": "f0fff4",
			"token": "meta.diff.header.to-file"
		},
		{
			"foreground": "176f2c",
			"background": "f0fff4",
			"token": "punctuation.definition.inserted"
		},
		{
			"foreground": "b08800",
			"background": "fffdef",
			"token": "markup.changed"
		},
		{
			"foreground": "b08800",
			"background": "fffdef",
			"token": "punctuation.definition.changed"
		},
		{
			"foreground": "2f363d",
			"background": "959da5",
			"token": "markup.ignored"
		},
		{
			"foreground": "2f363d",
			"background": "959da5",
			"token": "markup.untracked"
		},
		{
			"foreground": "b392f0",
			"fontStyle": "bold",
			"token": "meta.diff.range"
		},
		{
			"foreground": "c8e1ff",
			"token": "meta.diff.header"
		},
		{
			"foreground": "0366d6",
			"fontStyle": "bold",
			"token": "meta.separator"
		},
		{
			"foreground": "0366d6",
			"token": "meta.output"
		},
		{
			"foreground": "ffeef0",
			"token": "brackethighlighter.tag"
		},
		{
			"foreground": "ffeef0",
			"token": "brackethighlighter.curly"
		},
		{
			"foreground": "ffeef0",
			"token": "brackethighlighter.round"
		},
		{
			"foreground": "ffeef0",
			"token": "brackethighlighter.square"
		},
		{
			"foreground": "ffeef0",
			"token": "brackethighlighter.angle"
		},
		{
			"foreground": "ffeef0",
			"token": "brackethighlighter.quote"
		},
		{
			"foreground": "d73a49",
			"token": "brackethighlighter.unmatched"
		},
		{
			"foreground": "d73a49",
			"token": "sublimelinter.mark.error"
		},
		{
			"foreground": "fb8532",
			"token": "sublimelinter.mark.warning"
		},
		{
			"foreground": "6a737d",
			"token": "sublimelinter.gutter-mark"
		},
		{
			"foreground": "79b8ff",
			"fontStyle": "underline",
			"token": "constant.other.reference.link"
		},
		{
			"foreground": "79b8ff",
			"fontStyle": "underline",
			"token": "string.other.link"
		}
	],
	"colors": {
		"editor.foreground": "#f6f8fa",
		"editor.background": "#24292e",
		"editor.selectionBackground": "#4c2889",
		"editor.inactiveSelectionBackground": "#444d56",
		"editor.lineHighlightBackground": "#444d56",
		"editorCursor.foreground": "#ffffff",
		"editorWhitespace.foreground": "#6a737d",
		"editorIndentGuide.background": "#6a737d",
		"editorIndentGuide.activeBackground": "#f6f8fa",
		"editor.selectionHighlightBorder": "#444d56"
	}
} as Monaco.editor.IStandaloneThemeData

let githubLight = {
	"base": "vs",
	"inherit": true,
	"rules": [
		{
			"background": "ffffff",
			"token": ""
		},
		{
			"foreground": "6a737d",
			"token": "comment"
		},
		{
			"foreground": "6a737d",
			"token": "punctuation.definition.comment"
		},
		{
			"foreground": "6a737d",
			"token": "string.comment"
		},
		{
			"foreground": "005cc5",
			"token": "constant"
		},
		{
			"foreground": "005cc5",
			"token": "entity.name.constant"
		},
		{
			"foreground": "005cc5",
			"token": "variable.other.constant"
		},
		{
			"foreground": "005cc5",
			"token": "variable.language"
		},
		{
			"foreground": "6f42c1",
			"token": "entity"
		},
		{
			"foreground": "6f42c1",
			"token": "entity.name"
		},
		{
			"foreground": "24292e",
			"token": "variable.parameter.function"
		},
		{
			"foreground": "22863a",
			"token": "entity.name.tag"
		},
		{
			"foreground": "d73a49",
			"token": "keyword"
		},
		{
			"foreground": "d73a49",
			"token": "storage"
		},
		{
			"foreground": "d73a49",
			"token": "storage.type"
		},
		{
			"foreground": "24292e",
			"token": "storage.modifier.package"
		},
		{
			"foreground": "24292e",
			"token": "storage.modifier.import"
		},
		{
			"foreground": "24292e",
			"token": "storage.type.java"
		},
		{
			"foreground": "032f62",
			"token": "string"
		},
		{
			"foreground": "032f62",
			"token": "punctuation.definition.string"
		},
		{
			"foreground": "032f62",
			"token": "string punctuation.section.embedded source"
		},
		{
			"foreground": "005cc5",
			"token": "support"
		},
		{
			"foreground": "005cc5",
			"token": "meta.property-name"
		},
		{
			"foreground": "e36209",
			"token": "variable"
		},
		{
			"foreground": "24292e",
			"token": "variable.other"
		},
		{
			"foreground": "b31d28",
			"fontStyle": "bold italic underline",
			"token": "invalid.broken"
		},
		{
			"foreground": "b31d28",
			"fontStyle": "bold italic underline",
			"token": "invalid.deprecated"
		},
		{
			"foreground": "fafbfc",
			"background": "b31d28",
			"fontStyle": "italic underline",
			"token": "invalid.illegal"
		},
		{
			"foreground": "fafbfc",
			"background": "d73a49",
			"fontStyle": "italic underline",
			"token": "carriage-return"
		},
		{
			"foreground": "b31d28",
			"fontStyle": "bold italic underline",
			"token": "invalid.unimplemented"
		},
		{
			"foreground": "b31d28",
			"token": "message.error"
		},
		{
			"foreground": "24292e",
			"token": "string source"
		},
		{
			"foreground": "005cc5",
			"token": "string variable"
		},
		{
			"foreground": "032f62",
			"token": "source.regexp"
		},
		{
			"foreground": "032f62",
			"token": "string.regexp"
		},
		{
			"foreground": "032f62",
			"token": "string.regexp.character-class"
		},
		{
			"foreground": "032f62",
			"token": "string.regexp constant.character.escape"
		},
		{
			"foreground": "032f62",
			"token": "string.regexp source.ruby.embedded"
		},
		{
			"foreground": "032f62",
			"token": "string.regexp string.regexp.arbitrary-repitition"
		},
		{
			"foreground": "22863a",
			"fontStyle": "bold",
			"token": "string.regexp constant.character.escape"
		},
		{
			"foreground": "005cc5",
			"token": "support.constant"
		},
		{
			"foreground": "005cc5",
			"token": "support.variable"
		},
		{
			"foreground": "005cc5",
			"token": "meta.module-reference"
		},
		{
			"foreground": "735c0f",
			"token": "markup.list"
		},
		{
			"foreground": "005cc5",
			"fontStyle": "bold",
			"token": "markup.heading"
		},
		{
			"foreground": "005cc5",
			"fontStyle": "bold",
			"token": "markup.heading entity.name"
		},
		{
			"foreground": "22863a",
			"token": "markup.quote"
		},
		{
			"foreground": "24292e",
			"fontStyle": "italic",
			"token": "markup.italic"
		},
		{
			"foreground": "24292e",
			"fontStyle": "bold",
			"token": "markup.bold"
		},
		{
			"foreground": "005cc5",
			"token": "markup.raw"
		},
		{
			"foreground": "b31d28",
			"background": "ffeef0",
			"token": "markup.deleted"
		},
		{
			"foreground": "b31d28",
			"background": "ffeef0",
			"token": "meta.diff.header.from-file"
		},
		{
			"foreground": "b31d28",
			"background": "ffeef0",
			"token": "punctuation.definition.deleted"
		},
		{
			"foreground": "22863a",
			"background": "f0fff4",
			"token": "markup.inserted"
		},
		{
			"foreground": "22863a",
			"background": "f0fff4",
			"token": "meta.diff.header.to-file"
		},
		{
			"foreground": "22863a",
			"background": "f0fff4",
			"token": "punctuation.definition.inserted"
		},
		{
			"foreground": "e36209",
			"background": "ffebda",
			"token": "markup.changed"
		},
		{
			"foreground": "e36209",
			"background": "ffebda",
			"token": "punctuation.definition.changed"
		},
		{
			"foreground": "f6f8fa",
			"background": "005cc5",
			"token": "markup.ignored"
		},
		{
			"foreground": "f6f8fa",
			"background": "005cc5",
			"token": "markup.untracked"
		},
		{
			"foreground": "6f42c1",
			"fontStyle": "bold",
			"token": "meta.diff.range"
		},
		{
			"foreground": "005cc5",
			"token": "meta.diff.header"
		},
		{
			"foreground": "005cc5",
			"fontStyle": "bold",
			"token": "meta.separator"
		},
		{
			"foreground": "005cc5",
			"token": "meta.output"
		},
		{
			"foreground": "586069",
			"token": "brackethighlighter.tag"
		},
		{
			"foreground": "586069",
			"token": "brackethighlighter.curly"
		},
		{
			"foreground": "586069",
			"token": "brackethighlighter.round"
		},
		{
			"foreground": "586069",
			"token": "brackethighlighter.square"
		},
		{
			"foreground": "586069",
			"token": "brackethighlighter.angle"
		},
		{
			"foreground": "586069",
			"token": "brackethighlighter.quote"
		},
		{
			"foreground": "b31d28",
			"token": "brackethighlighter.unmatched"
		},
		{
			"foreground": "b31d28",
			"token": "sublimelinter.mark.error"
		},
		{
			"foreground": "e36209",
			"token": "sublimelinter.mark.warning"
		},
		{
			"foreground": "959da5",
			"token": "sublimelinter.gutter-mark"
		},
		{
			"foreground": "032f62",
			"fontStyle": "underline",
			"token": "constant.other.reference.link"
		},
		{
			"foreground": "032f62",
			"fontStyle": "underline",
			"token": "string.other.link"
		}
	],
	"colors": {
		"editor.foreground": "#24292e",
		"editor.background": "#ffffff",
		"editor.selectionBackground": "#c8c8fa",
		"editor.inactiveSelectionBackground": "#fafbfc",
		"editor.lineHighlightBackground": "#fafbfc",
		"editorCursor.foreground": "#24292e",
		"editorWhitespace.foreground": "#959da5",
		"editorIndentGuide.background": "#959da5",
		"editorIndentGuide.activeBackground": "#24292e",
		"editor.selectionHighlightBorder": "#fafbfc"
	}
} as Monaco.editor.IStandaloneThemeData

let github = {
	"base": "vs",
	"inherit": true,
	"rules": [
		{
			"background": "F8F8FF",
			"token": ""
		},
		{
			"foreground": "999988",
			"fontStyle": "italic",
			"token": "comment"
		},
		{
			"foreground": "999999",
			"fontStyle": "bold",
			"token": "comment.block.preprocessor"
		},
		{
			"foreground": "999999",
			"fontStyle": "bold italic",
			"token": "comment.documentation"
		},
		{
			"foreground": "999999",
			"fontStyle": "bold italic",
			"token": "comment.block.documentation"
		},
		{
			"foreground": "a61717",
			"background": "e3d2d2",
			"token": "invalid.illegal"
		},
		{
			"fontStyle": "bold",
			"token": "keyword"
		},
		{
			"fontStyle": "bold",
			"token": "storage"
		},
		{
			"fontStyle": "bold",
			"token": "keyword.operator"
		},
		{
			"fontStyle": "bold",
			"token": "constant.language"
		},
		{
			"fontStyle": "bold",
			"token": "support.constant"
		},
		{
			"foreground": "445588",
			"fontStyle": "bold",
			"token": "storage.type"
		},
		{
			"foreground": "445588",
			"fontStyle": "bold",
			"token": "support.type"
		},
		{
			"foreground": "008080",
			"token": "entity.other.attribute-name"
		},
		{
			"foreground": "0086b3",
			"token": "variable.other"
		},
		{
			"foreground": "999999",
			"token": "variable.language"
		},
		{
			"foreground": "445588",
			"fontStyle": "bold",
			"token": "entity.name.type"
		},
		{
			"foreground": "445588",
			"fontStyle": "bold",
			"token": "entity.other.inherited-class"
		},
		{
			"foreground": "445588",
			"fontStyle": "bold",
			"token": "support.class"
		},
		{
			"foreground": "008080",
			"token": "variable.other.constant"
		},
		{
			"foreground": "800080",
			"token": "constant.character.entity"
		},
		{
			"foreground": "990000",
			"token": "entity.name.exception"
		},
		{
			"foreground": "990000",
			"token": "entity.name.function"
		},
		{
			"foreground": "990000",
			"token": "support.function"
		},
		{
			"foreground": "990000",
			"token": "keyword.other.name-of-parameter"
		},
		{
			"foreground": "555555",
			"token": "entity.name.section"
		},
		{
			"foreground": "000080",
			"token": "entity.name.tag"
		},
		{
			"foreground": "008080",
			"token": "variable.parameter"
		},
		{
			"foreground": "008080",
			"token": "support.variable"
		},
		{
			"foreground": "009999",
			"token": "constant.numeric"
		},
		{
			"foreground": "009999",
			"token": "constant.other"
		},
		{
			"foreground": "dd1144",
			"token": "string - string source"
		},
		{
			"foreground": "dd1144",
			"token": "constant.character"
		},
		{
			"foreground": "009926",
			"token": "string.regexp"
		},
		{
			"foreground": "990073",
			"token": "constant.other.symbol"
		},
		{
			"fontStyle": "bold",
			"token": "punctuation"
		},
		{
			"foreground": "000000",
			"background": "ffdddd",
			"token": "markup.deleted"
		},
		{
			"fontStyle": "italic",
			"token": "markup.italic"
		},
		{
			"foreground": "aa0000",
			"token": "markup.error"
		},
		{
			"foreground": "999999",
			"token": "markup.heading.1"
		},
		{
			"foreground": "000000",
			"background": "ddffdd",
			"token": "markup.inserted"
		},
		{
			"foreground": "888888",
			"token": "markup.output"
		},
		{
			"foreground": "888888",
			"token": "markup.raw"
		},
		{
			"foreground": "555555",
			"token": "markup.prompt"
		},
		{
			"fontStyle": "bold",
			"token": "markup.bold"
		},
		{
			"foreground": "aaaaaa",
			"token": "markup.heading"
		},
		{
			"foreground": "aa0000",
			"token": "markup.traceback"
		},
		{
			"fontStyle": "underline",
			"token": "markup.underline"
		},
		{
			"foreground": "999999",
			"background": "eaf2f5",
			"token": "meta.diff.range"
		},
		{
			"foreground": "999999",
			"background": "eaf2f5",
			"token": "meta.diff.index"
		},
		{
			"foreground": "999999",
			"background": "eaf2f5",
			"token": "meta.separator"
		},
		{
			"foreground": "999999",
			"background": "ffdddd",
			"token": "meta.diff.header.from-file"
		},
		{
			"foreground": "999999",
			"background": "ddffdd",
			"token": "meta.diff.header.to-file"
		},
		{
			"foreground": "4183c4",
			"token": "meta.link"
		}
	],
	"colors": {
		"editor.foreground": "#000000",
		"editor.background": "#F8F8FF",
		"editor.selectionBackground": "#B4D5FE",
		"editor.lineHighlightBackground": "#FFFEEB",
		"editorCursor.foreground": "#666666",
		"editorWhitespace.foreground": "#BBBBBB"
	}
} as Monaco.editor.IStandaloneThemeData

let merbivoreSoft = {
	"base": "vs-dark",
	"inherit": true,
	"rules": [
		{
			"background": "161616",
			"token": ""
		},
		{
			"foreground": "ad2ea4",
			"fontStyle": "italic",
			"token": "comment"
		},
		{
			"foreground": "fc6f09",
			"token": "keyword"
		},
		{
			"foreground": "fc6f09",
			"token": "storage"
		},
		{
			"foreground": "fc83ff",
			"token": "entity.other.inherited-class"
		},
		{
			"foreground": "58c554",
			"token": "constant.numeric"
		},
		{
			"foreground": "1edafb",
			"token": "constant"
		},
		{
			"foreground": "8dff0a",
			"token": "constant.library"
		},
		{
			"foreground": "fc6f09",
			"token": "support.function"
		},
		{
			"foreground": "fdc251",
			"token": "constant.language"
		},
		{
			"foreground": "8dff0a",
			"token": "string"
		},
		{
			"foreground": "1edafb",
			"token": "support.type"
		},
		{
			"foreground": "8dff0a",
			"token": "support.constant"
		},
		{
			"foreground": "fc6f09",
			"token": "meta.tag"
		},
		{
			"foreground": "fc6f09",
			"token": "declaration.tag"
		},
		{
			"foreground": "fc6f09",
			"token": "entity.name.tag"
		},
		{
			"foreground": "ffff89",
			"token": "entity.other.attribute-name"
		},
		{
			"foreground": "ffffff",
			"background": "990000",
			"token": "invalid"
		},
		{
			"foreground": "519f50",
			"token": "constant.character.escaped"
		},
		{
			"foreground": "519f50",
			"token": "constant.character.escape"
		},
		{
			"foreground": "519f50",
			"token": "string source"
		},
		{
			"foreground": "519f50",
			"token": "string source.ruby"
		},
		{
			"foreground": "e6e1dc",
			"background": "144212",
			"token": "markup.inserted"
		},
		{
			"foreground": "e6e1dc",
			"background": "660000",
			"token": "markup.deleted"
		},
		{
			"background": "2f33ab",
			"token": "meta.diff.header"
		},
		{
			"background": "2f33ab",
			"token": "meta.separator.diff"
		},
		{
			"background": "2f33ab",
			"token": "meta.diff.index"
		},
		{
			"background": "2f33ab",
			"token": "meta.diff.range"
		}
	],
	"colors": {
		"editor.foreground": "#E6E1DC",
		"editor.background": "#161616",
		"editor.selectionBackground": "#454545",
		"editor.lineHighlightBackground": "#333435",
		"editorCursor.foreground": "#FFFFFF",
		"editorWhitespace.foreground": "#404040"
	}
} as Monaco.editor.IStandaloneThemeData

let monokai = {
	"base": "vs-dark",
	"inherit": true,
	"rules": [
		{
			"background": "272822",
			"token": ""
		},
		{
			"foreground": "75715e",
			"token": "comment"
		},
		{
			"foreground": "e6db74",
			"token": "string"
		},
		{
			"foreground": "ae81ff",
			"token": "constant.numeric"
		},
		{
			"foreground": "ae81ff",
			"token": "constant.language"
		},
		{
			"foreground": "ae81ff",
			"token": "constant.character"
		},
		{
			"foreground": "ae81ff",
			"token": "constant.other"
		},
		{
			"foreground": "f92672",
			"token": "keyword"
		},
		{
			"foreground": "f92672",
			"token": "storage"
		},
		{
			"foreground": "66d9ef",
			"fontStyle": "italic",
			"token": "storage.type"
		},
		{
			"foreground": "a6e22e",
			"fontStyle": "underline",
			"token": "entity.name.class"
		},
		{
			"foreground": "a6e22e",
			"fontStyle": "italic underline",
			"token": "entity.other.inherited-class"
		},
		{
			"foreground": "a6e22e",
			"token": "entity.name.function"
		},
		{
			"foreground": "fd971f",
			"fontStyle": "italic",
			"token": "variable.parameter"
		},
		{
			"foreground": "f92672",
			"token": "entity.name.tag"
		},
		{
			"foreground": "a6e22e",
			"token": "entity.other.attribute-name"
		},
		{
			"foreground": "66d9ef",
			"token": "support.function"
		},
		{
			"foreground": "66d9ef",
			"token": "support.constant"
		},
		{
			"foreground": "66d9ef",
			"fontStyle": "italic",
			"token": "support.type"
		},
		{
			"foreground": "66d9ef",
			"fontStyle": "italic",
			"token": "support.class"
		},
		{
			"foreground": "f8f8f0",
			"background": "f92672",
			"token": "invalid"
		},
		{
			"foreground": "f8f8f0",
			"background": "ae81ff",
			"token": "invalid.deprecated"
		},
		{
			"foreground": "cfcfc2",
			"token": "meta.structure.dictionary.json string.quoted.double.json"
		},
		{
			"foreground": "75715e",
			"token": "meta.diff"
		},
		{
			"foreground": "75715e",
			"token": "meta.diff.header"
		},
		{
			"foreground": "f92672",
			"token": "markup.deleted"
		},
		{
			"foreground": "a6e22e",
			"token": "markup.inserted"
		},
		{
			"foreground": "e6db74",
			"token": "markup.changed"
		},
		{
			"foreground": "ae81ffa0",
			"token": "constant.numeric.line-number.find-in-files - match"
		},
		{
			"foreground": "e6db74",
			"token": "entity.name.filename.find-in-files"
		}
	],
	"colors": {
		"editor.foreground": "#F8F8F2",
		"editor.background": "#272822",
		"editor.selectionBackground": "#49483E",
		"editor.lineHighlightBackground": "#3E3D32",
		"editorCursor.foreground": "#F8F8F0",
		"editorWhitespace.foreground": "#3B3A32",
		"editorIndentGuide.activeBackground": "#9D550FB0",
		"editor.selectionHighlightBorder": "#222218"
	}
} as Monaco.editor.IStandaloneThemeData

let nightOwl = {
	"base": "vs-dark",
	"inherit": true,
	"rules": [
		{
			"background": "011627",
			"token": ""
		},
		{
			"foreground": "637777",
			"token": "comment"
		},
		{
			"foreground": "addb67",
			"token": "string"
		},
		{
			"foreground": "ecc48d",
			"token": "vstring.quoted"
		},
		{
			"foreground": "ecc48d",
			"token": "variable.other.readwrite.js"
		},
		{
			"foreground": "5ca7e4",
			"token": "string.regexp"
		},
		{
			"foreground": "5ca7e4",
			"token": "string.regexp keyword.other"
		},
		{
			"foreground": "5f7e97",
			"token": "meta.function punctuation.separator.comma"
		},
		{
			"foreground": "f78c6c",
			"token": "constant.numeric"
		},
		{
			"foreground": "f78c6c",
			"token": "constant.character.numeric"
		},
		{
			"foreground": "addb67",
			"token": "variable"
		},
		{
			"foreground": "c792ea",
			"token": "keyword"
		},
		{
			"foreground": "c792ea",
			"token": "punctuation.accessor"
		},
		{
			"foreground": "c792ea",
			"token": "storage"
		},
		{
			"foreground": "c792ea",
			"token": "meta.var.expr"
		},
		{
			"foreground": "c792ea",
			"token": "meta.class meta.method.declaration meta.var.expr storage.type.jsm"
		},
		{
			"foreground": "c792ea",
			"token": "storage.type.property.js"
		},
		{
			"foreground": "c792ea",
			"token": "storage.type.property.ts"
		},
		{
			"foreground": "c792ea",
			"token": "storage.type.property.tsx"
		},
		{
			"foreground": "82aaff",
			"token": "storage.type"
		},
		{
			"foreground": "ffcb8b",
			"token": "entity.name.class"
		},
		{
			"foreground": "ffcb8b",
			"token": "meta.class entity.name.type.class"
		},
		{
			"foreground": "addb67",
			"token": "entity.other.inherited-class"
		},
		{
			"foreground": "82aaff",
			"token": "entity.name.function"
		},
		{
			"foreground": "addb67",
			"token": "punctuation.definition.variable"
		},
		{
			"foreground": "d3423e",
			"token": "punctuation.section.embedded"
		},
		{
			"foreground": "d6deeb",
			"token": "punctuation.terminator.expression"
		},
		{
			"foreground": "d6deeb",
			"token": "punctuation.definition.arguments"
		},
		{
			"foreground": "d6deeb",
			"token": "punctuation.definition.array"
		},
		{
			"foreground": "d6deeb",
			"token": "punctuation.section.array"
		},
		{
			"foreground": "d6deeb",
			"token": "meta.array"
		},
		{
			"foreground": "d9f5dd",
			"token": "punctuation.definition.list.begin"
		},
		{
			"foreground": "d9f5dd",
			"token": "punctuation.definition.list.end"
		},
		{
			"foreground": "d9f5dd",
			"token": "punctuation.separator.arguments"
		},
		{
			"foreground": "d9f5dd",
			"token": "punctuation.definition.list"
		},
		{
			"foreground": "d3423e",
			"token": "string.template meta.template.expression"
		},
		{
			"foreground": "d6deeb",
			"token": "string.template punctuation.definition.string"
		},
		{
			"foreground": "c792ea",
			"fontStyle": "italic",
			"token": "italic"
		},
		{
			"foreground": "addb67",
			"fontStyle": "bold",
			"token": "bold"
		},
		{
			"foreground": "82aaff",
			"token": "constant.language"
		},
		{
			"foreground": "82aaff",
			"token": "punctuation.definition.constant"
		},
		{
			"foreground": "82aaff",
			"token": "variable.other.constant"
		},
		{
			"foreground": "7fdbca",
			"token": "support.function.construct"
		},
		{
			"foreground": "7fdbca",
			"token": "keyword.other.new"
		},
		{
			"foreground": "82aaff",
			"token": "constant.character"
		},
		{
			"foreground": "82aaff",
			"token": "constant.other"
		},
		{
			"foreground": "f78c6c",
			"token": "constant.character.escape"
		},
		{
			"foreground": "addb67",
			"token": "entity.other.inherited-class"
		},
		{
			"foreground": "d7dbe0",
			"token": "variable.parameter"
		},
		{
			"foreground": "7fdbca",
			"token": "entity.name.tag"
		},
		{
			"foreground": "cc2996",
			"token": "punctuation.definition.tag.html"
		},
		{
			"foreground": "cc2996",
			"token": "punctuation.definition.tag.begin"
		},
		{
			"foreground": "cc2996",
			"token": "punctuation.definition.tag.end"
		},
		{
			"foreground": "addb67",
			"token": "entity.other.attribute-name"
		},
		{
			"foreground": "addb67",
			"token": "entity.name.tag.custom"
		},
		{
			"foreground": "82aaff",
			"token": "support.function"
		},
		{
			"foreground": "82aaff",
			"token": "support.constant"
		},
		{
			"foreground": "7fdbca",
			"token": "upport.constant.meta.property-value"
		},
		{
			"foreground": "addb67",
			"token": "support.type"
		},
		{
			"foreground": "addb67",
			"token": "support.class"
		},
		{
			"foreground": "addb67",
			"token": "support.variable.dom"
		},
		{
			"foreground": "7fdbca",
			"token": "support.constant"
		},
		{
			"foreground": "7fdbca",
			"token": "keyword.other.special-method"
		},
		{
			"foreground": "7fdbca",
			"token": "keyword.other.new"
		},
		{
			"foreground": "7fdbca",
			"token": "keyword.other.debugger"
		},
		{
			"foreground": "7fdbca",
			"token": "keyword.control"
		},
		{
			"foreground": "c792ea",
			"token": "keyword.operator.comparison"
		},
		{
			"foreground": "c792ea",
			"token": "keyword.control.flow.js"
		},
		{
			"foreground": "c792ea",
			"token": "keyword.control.flow.ts"
		},
		{
			"foreground": "c792ea",
			"token": "keyword.control.flow.tsx"
		},
		{
			"foreground": "c792ea",
			"token": "keyword.control.ruby"
		},
		{
			"foreground": "c792ea",
			"token": "keyword.control.module.ruby"
		},
		{
			"foreground": "c792ea",
			"token": "keyword.control.class.ruby"
		},
		{
			"foreground": "c792ea",
			"token": "keyword.control.def.ruby"
		},
		{
			"foreground": "c792ea",
			"token": "keyword.control.loop.js"
		},
		{
			"foreground": "c792ea",
			"token": "keyword.control.loop.ts"
		},
		{
			"foreground": "c792ea",
			"token": "keyword.control.import.js"
		},
		{
			"foreground": "c792ea",
			"token": "keyword.control.import.ts"
		},
		{
			"foreground": "c792ea",
			"token": "keyword.control.import.tsx"
		},
		{
			"foreground": "c792ea",
			"token": "keyword.control.from.js"
		},
		{
			"foreground": "c792ea",
			"token": "keyword.control.from.ts"
		},
		{
			"foreground": "c792ea",
			"token": "keyword.control.from.tsx"
		},
		{
			"foreground": "ffffff",
			"background": "ff2c83",
			"token": "invalid"
		},
		{
			"foreground": "ffffff",
			"background": "d3423e",
			"token": "invalid.deprecated"
		},
		{
			"foreground": "7fdbca",
			"token": "keyword.operator"
		},
		{
			"foreground": "c792ea",
			"token": "keyword.operator.relational"
		},
		{
			"foreground": "c792ea",
			"token": "keyword.operator.assignement"
		},
		{
			"foreground": "c792ea",
			"token": "keyword.operator.arithmetic"
		},
		{
			"foreground": "c792ea",
			"token": "keyword.operator.bitwise"
		},
		{
			"foreground": "c792ea",
			"token": "keyword.operator.increment"
		},
		{
			"foreground": "c792ea",
			"token": "keyword.operator.ternary"
		},
		{
			"foreground": "637777",
			"token": "comment.line.double-slash"
		},
		{
			"foreground": "cdebf7",
			"token": "object"
		},
		{
			"foreground": "ff5874",
			"token": "constant.language.null"
		},
		{
			"foreground": "d6deeb",
			"token": "meta.brace"
		},
		{
			"foreground": "c792ea",
			"token": "meta.delimiter.period"
		},
		{
			"foreground": "d9f5dd",
			"token": "punctuation.definition.string"
		},
		{
			"foreground": "ff5874",
			"token": "constant.language.boolean"
		},
		{
			"foreground": "ffffff",
			"token": "object.comma"
		},
		{
			"foreground": "7fdbca",
			"token": "variable.parameter.function"
		},
		{
			"foreground": "80cbc4",
			"token": "support.type.vendor.property-name"
		},
		{
			"foreground": "80cbc4",
			"token": "support.constant.vendor.property-value"
		},
		{
			"foreground": "80cbc4",
			"token": "support.type.property-name"
		},
		{
			"foreground": "80cbc4",
			"token": "meta.property-list entity.name.tag"
		},
		{
			"foreground": "57eaf1",
			"token": "meta.property-list entity.name.tag.reference"
		},
		{
			"foreground": "f78c6c",
			"token": "constant.other.color.rgb-value punctuation.definition.constant"
		},
		{
			"foreground": "ffeb95",
			"token": "constant.other.color"
		},
		{
			"foreground": "ffeb95",
			"token": "keyword.other.unit"
		},
		{
			"foreground": "c792ea",
			"token": "meta.selector"
		},
		{
			"foreground": "fad430",
			"token": "entity.other.attribute-name.id"
		},
		{
			"foreground": "80cbc4",
			"token": "meta.property-name"
		},
		{
			"foreground": "c792ea",
			"token": "entity.name.tag.doctype"
		},
		{
			"foreground": "c792ea",
			"token": "meta.tag.sgml.doctype"
		},
		{
			"foreground": "d9f5dd",
			"token": "punctuation.definition.parameters"
		},
		{
			"foreground": "ecc48d",
			"token": "string.quoted"
		},
		{
			"foreground": "ecc48d",
			"token": "string.quoted.double"
		},
		{
			"foreground": "ecc48d",
			"token": "string.quoted.single"
		},
		{
			"foreground": "addb67",
			"token": "support.constant.math"
		},
		{
			"foreground": "addb67",
			"token": "support.type.property-name.json"
		},
		{
			"foreground": "addb67",
			"token": "support.constant.json"
		},
		{
			"foreground": "c789d6",
			"token": "meta.structure.dictionary.value.json string.quoted.double"
		},
		{
			"foreground": "80cbc4",
			"token": "string.quoted.double.json punctuation.definition.string.json"
		},
		{
			"foreground": "ff5874",
			"token": "meta.structure.dictionary.json meta.structure.dictionary.value constant.language"
		},
		{
			"foreground": "d6deeb",
			"token": "variable.other.ruby"
		},
		{
			"foreground": "ecc48d",
			"token": "entity.name.type.class.ruby"
		},
		{
			"foreground": "ecc48d",
			"token": "keyword.control.class.ruby"
		},
		{
			"foreground": "ecc48d",
			"token": "meta.class.ruby"
		},
		{
			"foreground": "7fdbca",
			"token": "constant.language.symbol.hashkey.ruby"
		},
		{
			"foreground": "e0eddd",
			"background": "a57706",
			"fontStyle": "italic",
			"token": "meta.diff"
		},
		{
			"foreground": "e0eddd",
			"background": "a57706",
			"fontStyle": "italic",
			"token": "meta.diff.header"
		},
		{
			"foreground": "ef535090",
			"fontStyle": "italic",
			"token": "markup.deleted"
		},
		{
			"foreground": "a2bffc",
			"fontStyle": "italic",
			"token": "markup.changed"
		},
		{
			"foreground": "a2bffc",
			"fontStyle": "italic",
			"token": "meta.diff.header.git"
		},
		{
			"foreground": "a2bffc",
			"fontStyle": "italic",
			"token": "meta.diff.header.from-file"
		},
		{
			"foreground": "a2bffc",
			"fontStyle": "italic",
			"token": "meta.diff.header.to-file"
		},
		{
			"foreground": "219186",
			"background": "eae3ca",
			"token": "markup.inserted"
		},
		{
			"foreground": "d3201f",
			"token": "other.package.exclude"
		},
		{
			"foreground": "d3201f",
			"token": "other.remove"
		},
		{
			"foreground": "269186",
			"token": "other.add"
		},
		{
			"foreground": "ff5874",
			"token": "constant.language.python"
		},
		{
			"foreground": "82aaff",
			"token": "variable.parameter.function.python"
		},
		{
			"foreground": "82aaff",
			"token": "meta.function-call.arguments.python"
		},
		{
			"foreground": "b2ccd6",
			"token": "meta.function-call.python"
		},
		{
			"foreground": "b2ccd6",
			"token": "meta.function-call.generic.python"
		},
		{
			"foreground": "d6deeb",
			"token": "punctuation.python"
		},
		{
			"foreground": "addb67",
			"token": "entity.name.function.decorator.python"
		},
		{
			"foreground": "8eace3",
			"token": "source.python variable.language.special"
		},
		{
			"foreground": "82b1ff",
			"token": "markup.heading.markdown"
		},
		{
			"foreground": "c792ea",
			"fontStyle": "italic",
			"token": "markup.italic.markdown"
		},
		{
			"foreground": "addb67",
			"fontStyle": "bold",
			"token": "markup.bold.markdown"
		},
		{
			"foreground": "697098",
			"token": "markup.quote.markdown"
		},
		{
			"foreground": "80cbc4",
			"token": "markup.inline.raw.markdown"
		},
		{
			"foreground": "ff869a",
			"token": "markup.underline.link.markdown"
		},
		{
			"foreground": "ff869a",
			"token": "markup.underline.link.image.markdown"
		},
		{
			"foreground": "d6deeb",
			"token": "string.other.link.title.markdown"
		},
		{
			"foreground": "d6deeb",
			"token": "string.other.link.description.markdown"
		},
		{
			"foreground": "82b1ff",
			"token": "punctuation.definition.string.markdown"
		},
		{
			"foreground": "82b1ff",
			"token": "punctuation.definition.string.begin.markdown"
		},
		{
			"foreground": "82b1ff",
			"token": "punctuation.definition.string.end.markdown"
		},
		{
			"foreground": "82b1ff",
			"token": "meta.link.inline.markdown punctuation.definition.string"
		},
		{
			"foreground": "7fdbca",
			"token": "punctuation.definition.metadata.markdown"
		},
		{
			"foreground": "82b1ff",
			"token": "beginning.punctuation.definition.list.markdown"
		}
	],
	"colors": {
		"editor.foreground": "#d6deeb",
		"editor.background": "#011627",
		"editor.selectionBackground": "#5f7e9779",
		"editor.lineHighlightBackground": "#010E17",
		"editorCursor.foreground": "#80a4c2",
		"editorWhitespace.foreground": "#2e2040",
		"editorIndentGuide.background": "#5e81ce52",
		"editor.selectionHighlightBorder": "#122d42"
	}
} as Monaco.editor.IStandaloneThemeData

let nord = {
	"base": "vs-dark",
	"inherit": true,
	"rules": [
		{
			"background": "2E3440",
			"token": ""
		},
		{
			"foreground": "616e88",
			"token": "comment"
		},
		{
			"foreground": "a3be8c",
			"token": "string"
		},
		{
			"foreground": "b48ead",
			"token": "constant.numeric"
		},
		{
			"foreground": "81a1c1",
			"token": "constant.language"
		},
		{
			"foreground": "81a1c1",
			"token": "keyword"
		},
		{
			"foreground": "81a1c1",
			"token": "storage"
		},
		{
			"foreground": "81a1c1",
			"token": "storage.type"
		},
		{
			"foreground": "8fbcbb",
			"token": "entity.name.class"
		},
		{
			"foreground": "8fbcbb",
			"fontStyle": "  bold",
			"token": "entity.other.inherited-class"
		},
		{
			"foreground": "88c0d0",
			"token": "entity.name.function"
		},
		{
			"foreground": "81a1c1",
			"token": "entity.name.tag"
		},
		{
			"foreground": "8fbcbb",
			"token": "entity.other.attribute-name"
		},
		{
			"foreground": "88c0d0",
			"token": "support.function"
		},
		{
			"foreground": "f8f8f0",
			"background": "f92672",
			"token": "invalid"
		},
		{
			"foreground": "f8f8f0",
			"background": "ae81ff",
			"token": "invalid.deprecated"
		},
		{
			"foreground": "b48ead",
			"token": "constant.color.other.rgb-value"
		},
		{
			"foreground": "ebcb8b",
			"token": "constant.character.escape"
		},
		{
			"foreground": "8fbcbb",
			"token": "variable.other.constant"
		}
	],
	"colors": {
		"editor.foreground": "#D8DEE9",
		"editor.background": "#2E3440",
		"editor.selectionBackground": "#434C5ECC",
		"editor.lineHighlightBackground": "#3B4252",
		"editorCursor.foreground": "#D8DEE9",
		"editorWhitespace.foreground": "#434C5ECC"
	}
} as Monaco.editor.IStandaloneThemeData

let oceanicNext = {
	"base": "vs-dark",
	"inherit": true,
	"rules": [
		{
			"background": "1B2B34",
			"token": ""
		},
		{
			"foreground": "65737e",
			"token": "comment"
		},
		{
			"foreground": "65737e",
			"token": "punctuation.definition.comment"
		},
		{
			"foreground": "cdd3de",
			"token": "variable"
		},
		{
			"foreground": "c594c5",
			"token": "keyword"
		},
		{
			"foreground": "c594c5",
			"token": "storage.type"
		},
		{
			"foreground": "c594c5",
			"token": "storage.modifier"
		},
		{
			"foreground": "5fb3b3",
			"token": "keyword.operator"
		},
		{
			"foreground": "5fb3b3",
			"token": "constant.other.color"
		},
		{
			"foreground": "5fb3b3",
			"token": "punctuation"
		},
		{
			"foreground": "5fb3b3",
			"token": "meta.tag"
		},
		{
			"foreground": "5fb3b3",
			"token": "punctuation.definition.tag"
		},
		{
			"foreground": "5fb3b3",
			"token": "punctuation.separator.inheritance.php"
		},
		{
			"foreground": "5fb3b3",
			"token": "punctuation.definition.tag.html"
		},
		{
			"foreground": "5fb3b3",
			"token": "punctuation.definition.tag.begin.html"
		},
		{
			"foreground": "5fb3b3",
			"token": "punctuation.definition.tag.end.html"
		},
		{
			"foreground": "5fb3b3",
			"token": "punctuation.section.embedded"
		},
		{
			"foreground": "5fb3b3",
			"token": "keyword.other.template"
		},
		{
			"foreground": "5fb3b3",
			"token": "keyword.other.substitution"
		},
		{
			"foreground": "eb606b",
			"token": "entity.name.tag"
		},
		{
			"foreground": "eb606b",
			"token": "meta.tag.sgml"
		},
		{
			"foreground": "eb606b",
			"token": "markup.deleted.git_gutter"
		},
		{
			"foreground": "6699cc",
			"token": "entity.name.function"
		},
		{
			"foreground": "6699cc",
			"token": "meta.function-call"
		},
		{
			"foreground": "6699cc",
			"token": "variable.function"
		},
		{
			"foreground": "6699cc",
			"token": "support.function"
		},
		{
			"foreground": "6699cc",
			"token": "keyword.other.special-method"
		},
		{
			"foreground": "6699cc",
			"token": "meta.block-level"
		},
		{
			"foreground": "f2777a",
			"token": "support.other.variable"
		},
		{
			"foreground": "f2777a",
			"token": "string.other.link"
		},
		{
			"foreground": "f99157",
			"token": "constant.numeric"
		},
		{
			"foreground": "f99157",
			"token": "constant.language"
		},
		{
			"foreground": "f99157",
			"token": "support.constant"
		},
		{
			"foreground": "f99157",
			"token": "constant.character"
		},
		{
			"foreground": "f99157",
			"token": "variable.parameter"
		},
		{
			"foreground": "f99157",
			"token": "keyword.other.unit"
		},
		{
			"foreground": "99c794",
			"fontStyle": "normal",
			"token": "string"
		},
		{
			"foreground": "99c794",
			"fontStyle": "normal",
			"token": "constant.other.symbol"
		},
		{
			"foreground": "99c794",
			"fontStyle": "normal",
			"token": "constant.other.key"
		},
		{
			"foreground": "99c794",
			"fontStyle": "normal",
			"token": "entity.other.inherited-class"
		},
		{
			"foreground": "99c794",
			"fontStyle": "normal",
			"token": "markup.heading"
		},
		{
			"foreground": "99c794",
			"fontStyle": "normal",
			"token": "markup.inserted.git_gutter"
		},
		{
			"foreground": "99c794",
			"fontStyle": "normal",
			"token": "meta.group.braces.curly constant.other.object.key.js string.unquoted.label.js"
		},
		{
			"foreground": "fac863",
			"token": "entity.name.class"
		},
		{
			"foreground": "fac863",
			"token": "entity.name.type.class"
		},
		{
			"foreground": "fac863",
			"token": "support.type"
		},
		{
			"foreground": "fac863",
			"token": "support.class"
		},
		{
			"foreground": "fac863",
			"token": "support.orther.namespace.use.php"
		},
		{
			"foreground": "fac863",
			"token": "meta.use.php"
		},
		{
			"foreground": "fac863",
			"token": "support.other.namespace.php"
		},
		{
			"foreground": "fac863",
			"token": "markup.changed.git_gutter"
		},
		{
			"foreground": "ec5f67",
			"token": "entity.name.module.js"
		},
		{
			"foreground": "ec5f67",
			"token": "variable.import.parameter.js"
		},
		{
			"foreground": "ec5f67",
			"token": "variable.other.class.js"
		},
		{
			"foreground": "ec5f67",
			"fontStyle": "italic",
			"token": "variable.language"
		},
		{
			"foreground": "cdd3de",
			"token": "meta.group.braces.curly.js constant.other.object.key.js string.unquoted.label.js"
		},
		{
			"foreground": "d8dee9",
			"token": "meta.class-method.js entity.name.function.js"
		},
		{
			"foreground": "d8dee9",
			"token": "variable.function.constructor"
		},
		{
			"foreground": "d8dee9",
			"token": "meta.class.js meta.class.property.js meta.method.js string.unquoted.js entity.name.function.js"
		},
		{
			"foreground": "bb80b3",
			"token": "entity.other.attribute-name"
		},
		{
			"foreground": "99c794",
			"token": "markup.inserted"
		},
		{
			"foreground": "ec5f67",
			"token": "markup.deleted"
		},
		{
			"foreground": "bb80b3",
			"token": "markup.changed"
		},
		{
			"foreground": "5fb3b3",
			"token": "string.regexp"
		},
		{
			"foreground": "5fb3b3",
			"token": "constant.character.escape"
		},
		{
			"fontStyle": "underline",
			"token": "*url*"
		},
		{
			"fontStyle": "underline",
			"token": "*link*"
		},
		{
			"fontStyle": "underline",
			"token": "*uri*"
		},
		{
			"foreground": "ab7967",
			"token": "constant.numeric.line-number.find-in-files - match"
		},
		{
			"foreground": "99c794",
			"token": "entity.name.filename.find-in-files"
		},
		{
			"foreground": "6699cc",
			"fontStyle": "italic",
			"token": "tag.decorator.js entity.name.tag.js"
		},
		{
			"foreground": "6699cc",
			"fontStyle": "italic",
			"token": "tag.decorator.js punctuation.definition.tag.js"
		},
		{
			"foreground": "ec5f67",
			"fontStyle": "italic",
			"token": "source.js constant.other.object.key.js string.unquoted.label.js"
		},
		{
			"foreground": "fac863",
			"token": "source.json meta meta meta meta meta meta meta meta meta meta meta meta meta meta meta meta.structure.dictionary.json string.quoted.double.json - meta meta meta meta meta meta meta meta meta meta meta meta meta meta meta meta.structure.dictionary.json meta.structure.dictionary.value.json string.quoted.double.json"
		},
		{
			"foreground": "fac863",
			"token": "source.json meta meta meta meta meta meta meta meta meta meta meta meta meta meta meta meta.structure.dictionary.json punctuation.definition.string - meta meta meta meta meta meta meta meta meta meta meta meta meta meta meta meta.structure.dictionary.json meta.structure.dictionary.value.json punctuation.definition.string"
		},
		{
			"foreground": "c594c5",
			"token": "source.json meta meta meta meta meta meta meta meta meta meta meta meta meta meta.structure.dictionary.json string.quoted.double.json - meta meta meta meta meta meta meta meta meta meta meta meta meta meta.structure.dictionary.json meta.structure.dictionary.value.json string.quoted.double.json"
		},
		{
			"foreground": "c594c5",
			"token": "source.json meta meta meta meta meta meta meta meta meta meta meta meta meta meta.structure.dictionary.json punctuation.definition.string - meta meta meta meta meta meta meta meta meta meta meta meta meta meta.structure.dictionary.json meta.structure.dictionary.value.json punctuation.definition.string"
		},
		{
			"foreground": "d8dee9",
			"token": "source.json meta meta meta meta meta meta meta meta meta meta meta meta.structure.dictionary.json string.quoted.double.json - meta meta meta meta meta meta meta meta meta meta meta meta.structure.dictionary.json meta.structure.dictionary.value.json string.quoted.double.json"
		},
		{
			"foreground": "d8dee9",
			"token": "source.json meta meta meta meta meta meta meta meta meta meta meta meta.structure.dictionary.json punctuation.definition.string - meta meta meta meta meta meta meta meta meta meta meta meta.structure.dictionary.json meta.structure.dictionary.value.json punctuation.definition.string"
		},
		{
			"foreground": "6699cc",
			"token": "source.json meta meta meta meta meta meta meta meta meta meta.structure.dictionary.json string.quoted.double.json - meta meta meta meta meta meta meta meta meta meta.structure.dictionary.json meta.structure.dictionary.value.json string.quoted.double.json"
		},
		{
			"foreground": "6699cc",
			"token": "source.json meta meta meta meta meta meta meta meta meta meta.structure.dictionary.json punctuation.definition.string - meta meta meta meta meta meta meta meta meta meta.structure.dictionary.json meta.structure.dictionary.value.json punctuation.definition.string"
		},
		{
			"foreground": "ab7967",
			"token": "source.json meta meta meta meta meta meta meta meta.structure.dictionary.json string.quoted.double.json - meta meta meta meta meta meta meta meta.structure.dictionary.json meta.structure.dictionary.value.json string.quoted.double.json"
		},
		{
			"foreground": "ab7967",
			"token": "source.json meta meta meta meta meta meta meta meta.structure.dictionary.json punctuation.definition.string - meta meta meta meta meta meta meta meta.structure.dictionary.json meta.structure.dictionary.value.json punctuation.definition.string"
		},
		{
			"foreground": "ec5f67",
			"token": "source.json meta meta meta meta meta meta.structure.dictionary.json string.quoted.double.json - meta meta meta meta meta meta.structure.dictionary.json meta.structure.dictionary.value.json string.quoted.double.json"
		},
		{
			"foreground": "ec5f67",
			"token": "source.json meta meta meta meta meta meta.structure.dictionary.json punctuation.definition.string - meta meta meta meta meta meta.structure.dictionary.json meta.structure.dictionary.value.json punctuation.definition.string"
		},
		{
			"foreground": "f99157",
			"token": "source.json meta meta meta meta.structure.dictionary.json string.quoted.double.json - meta meta meta meta.structure.dictionary.json meta.structure.dictionary.value.json string.quoted.double.json"
		},
		{
			"foreground": "f99157",
			"token": "source.json meta meta meta meta.structure.dictionary.json punctuation.definition.string - meta meta meta meta.structure.dictionary.json meta.structure.dictionary.value.json punctuation.definition.string"
		},
		{
			"foreground": "fac863",
			"token": "source.json meta meta.structure.dictionary.json string.quoted.double.json - meta meta.structure.dictionary.json meta.structure.dictionary.value.json string.quoted.double.json"
		},
		{
			"foreground": "fac863",
			"token": "source.json meta meta.structure.dictionary.json punctuation.definition.string - meta meta.structure.dictionary.json meta.structure.dictionary.value.json punctuation.definition.string"
		},
		{
			"foreground": "c594c5",
			"token": "source.json meta.structure.dictionary.json string.quoted.double.json - meta.structure.dictionary.json meta.structure.dictionary.value.json string.quoted.double.json"
		},
		{
			"foreground": "c594c5",
			"token": "source.json meta.structure.dictionary.json punctuation.definition.string - meta.structure.dictionary.json meta.structure.dictionary.value.json punctuation.definition.string"
		}
	],
	"colors": {
		"editor.foreground": "#CDD3DE",
		"editor.background": "#1B2B34",
		"editor.selectionBackground": "#4f5b66",
		"editor.lineHighlightBackground": "#65737e55",
		"editorCursor.foreground": "#c0c5ce",
		"editorWhitespace.foreground": "#65737e",
		"editorIndentGuide.background": "#65737F",
		"editorIndentGuide.activeBackground": "#FBC95A"
	}
} as Monaco.editor.IStandaloneThemeData

let pastelsOnDark = {
	"base": "vs-dark",
	"inherit": true,
	"rules": [
		{
			"background": "211E1E",
			"token": ""
		},
		{
			"foreground": "555555",
			"token": "comment"
		},
		{
			"foreground": "555555",
			"token": "comment.block"
		},
		{
			"foreground": "ad9361",
			"token": "string"
		},
		{
			"foreground": "cccccc",
			"token": "constant.numeric"
		},
		{
			"foreground": "a1a1ff",
			"token": "keyword"
		},
		{
			"foreground": "2f006e",
			"token": "meta.preprocessor"
		},
		{
			"fontStyle": "bold",
			"token": "keyword.control.import"
		},
		{
			"foreground": "a1a1ff",
			"token": "support.function"
		},
		{
			"foreground": "0000ff",
			"token": "declaration.function function-result"
		},
		{
			"fontStyle": "bold",
			"token": "declaration.function function-name"
		},
		{
			"fontStyle": "bold",
			"token": "declaration.function argument-name"
		},
		{
			"foreground": "0000ff",
			"token": "declaration.function function-arg-type"
		},
		{
			"fontStyle": "italic",
			"token": "declaration.function function-argument"
		},
		{
			"fontStyle": "underline",
			"token": "declaration.class class-name"
		},
		{
			"fontStyle": "italic underline",
			"token": "declaration.class class-inheritance"
		},
		{
			"foreground": "fff9f9",
			"background": "ff0000",
			"fontStyle": "bold",
			"token": "invalid"
		},
		{
			"background": "ffd0d0",
			"token": "invalid.deprecated.trailing-whitespace"
		},
		{
			"fontStyle": "italic",
			"token": "declaration.section section-name"
		},
		{
			"foreground": "c10006",
			"token": "string.interpolation"
		},
		{
			"foreground": "666666",
			"token": "string.regexp"
		},
		{
			"foreground": "c1c144",
			"token": "variable"
		},
		{
			"foreground": "6782d3",
			"token": "constant"
		},
		{
			"foreground": "afa472",
			"token": "constant.character"
		},
		{
			"foreground": "de8e30",
			"fontStyle": "bold",
			"token": "constant.language"
		},
		{
			"fontStyle": "underline",
			"token": "embedded"
		},
		{
			"foreground": "858ef4",
			"token": "keyword.markup.element-name"
		},
		{
			"foreground": "9b456f",
			"token": "keyword.markup.attribute-name"
		},
		{
			"foreground": "9b456f",
			"token": "meta.attribute-with-value"
		},
		{
			"foreground": "c82255",
			"fontStyle": "bold",
			"token": "keyword.exception"
		},
		{
			"foreground": "47b8d6",
			"token": "keyword.operator"
		},
		{
			"foreground": "6969fa",
			"fontStyle": "bold",
			"token": "keyword.control"
		},
		{
			"foreground": "68685b",
			"token": "meta.tag.preprocessor.xml"
		},
		{
			"foreground": "888888",
			"token": "meta.tag.sgml.doctype"
		},
		{
			"fontStyle": "italic",
			"token": "string.quoted.docinfo.doctype.DTD"
		},
		{
			"foreground": "909090",
			"token": "comment.other.server-side-include.xhtml"
		},
		{
			"foreground": "909090",
			"token": "comment.other.server-side-include.html"
		},
		{
			"foreground": "858ef4",
			"token": "text.html declaration.tag"
		},
		{
			"foreground": "858ef4",
			"token": "text.html meta.tag"
		},
		{
			"foreground": "858ef4",
			"token": "text.html entity.name.tag.xhtml"
		},
		{
			"foreground": "9b456f",
			"token": "keyword.markup.attribute-name"
		},
		{
			"foreground": "777777",
			"token": "keyword.other.phpdoc.php"
		},
		{
			"foreground": "c82255",
			"token": "keyword.other.include.php"
		},
		{
			"foreground": "de8e20",
			"fontStyle": "bold",
			"token": "support.constant.core.php"
		},
		{
			"foreground": "de8e10",
			"fontStyle": "bold",
			"token": "support.constant.std.php"
		},
		{
			"foreground": "b72e1d",
			"token": "variable.other.global.php"
		},
		{
			"foreground": "00ff00",
			"token": "variable.other.global.safer.php"
		},
		{
			"foreground": "bfa36d",
			"token": "string.quoted.single.php"
		},
		{
			"foreground": "6969fa",
			"token": "keyword.storage.php"
		},
		{
			"foreground": "ad9361",
			"token": "string.quoted.double.php"
		},
		{
			"foreground": "ec9e00",
			"token": "entity.other.attribute-name.id.css"
		},
		{
			"foreground": "b8cd06",
			"fontStyle": "bold",
			"token": "entity.name.tag.css"
		},
		{
			"foreground": "edca06",
			"token": "entity.other.attribute-name.class.css"
		},
		{
			"foreground": "2e759c",
			"token": "entity.other.attribute-name.pseudo-class.css"
		},
		{
			"foreground": "ffffff",
			"background": "ff0000",
			"token": "invalid.bad-comma.css"
		},
		{
			"foreground": "9b2e4d",
			"token": "support.constant.property-value.css"
		},
		{
			"foreground": "e1c96b",
			"token": "support.type.property-name.css"
		},
		{
			"foreground": "666633",
			"token": "constant.other.rgb-value.css"
		},
		{
			"foreground": "666633",
			"token": "support.constant.font-name.css"
		},
		{
			"foreground": "7171f3",
			"token": "support.constant.tm-language-def"
		},
		{
			"foreground": "7171f3",
			"token": "support.constant.name.tm-language-def"
		},
		{
			"foreground": "6969fa",
			"token": "keyword.other.unit.css"
		}
	],
	"colors": {
		"editor.foreground": "#DADADA",
		"editor.background": "#211E1E",
		"editor.selectionBackground": "#73597E80",
		"editor.lineHighlightBackground": "#353030",
		"editorCursor.foreground": "#FFFFFF",
		"editorWhitespace.foreground": "#4F4D4D"
	}
} as Monaco.editor.IStandaloneThemeData

let sunburst = {
	"base": "vs-dark",
	"inherit": true,
	"rules": [
		{
			"background": "000000",
			"token": ""
		},
		{
			"foreground": "aeaeae",
			"fontStyle": "italic",
			"token": "comment"
		},
		{
			"foreground": "3387cc",
			"token": "constant"
		},
		{
			"foreground": "89bdff",
			"token": "entity"
		},
		{
			"foreground": "e28964",
			"token": "keyword"
		},
		{
			"foreground": "99cf50",
			"token": "storage"
		},
		{
			"foreground": "65b042",
			"token": "string"
		},
		{
			"foreground": "9b859d",
			"token": "support"
		},
		{
			"foreground": "3e87e3",
			"token": "variable"
		},
		{
			"foreground": "fd5ff1",
			"fontStyle": "italic underline",
			"token": "invalid.deprecated"
		},
		{
			"foreground": "fd5ff1",
			"background": "562d56bf",
			"token": "invalid.illegal"
		},
		{
			"background": "b1b3ba08",
			"token": "text source"
		},
		{
			"foreground": "9b5c2e",
			"fontStyle": "italic",
			"token": "entity.other.inherited-class"
		},
		{
			"foreground": "daefa3",
			"token": "string.quoted source"
		},
		{
			"foreground": "ddf2a4",
			"token": "string constant"
		},
		{
			"foreground": "e9c062",
			"token": "string.regexp"
		},
		{
			"foreground": "cf7d34",
			"token": "string.regexp constant.character.escape"
		},
		{
			"foreground": "cf7d34",
			"token": "string.regexp source.ruby.embedded"
		},
		{
			"foreground": "cf7d34",
			"token": "string.regexp string.regexp.arbitrary-repitition"
		},
		{
			"foreground": "8a9a95",
			"token": "string variable"
		},
		{
			"foreground": "dad085",
			"token": "support.function"
		},
		{
			"foreground": "cf6a4c",
			"token": "support.constant"
		},
		{
			"foreground": "8996a8",
			"token": "meta.preprocessor.c"
		},
		{
			"foreground": "afc4db",
			"token": "meta.preprocessor.c keyword"
		},
		{
			"fontStyle": "underline",
			"token": "entity.name.type"
		},
		{
			"foreground": "676767",
			"fontStyle": "italic",
			"token": "meta.cast"
		},
		{
			"foreground": "494949",
			"token": "meta.sgml.html meta.doctype"
		},
		{
			"foreground": "494949",
			"token": "meta.sgml.html meta.doctype entity"
		},
		{
			"foreground": "494949",
			"token": "meta.sgml.html meta.doctype string"
		},
		{
			"foreground": "494949",
			"token": "meta.xml-processing"
		},
		{
			"foreground": "494949",
			"token": "meta.xml-processing entity"
		},
		{
			"foreground": "494949",
			"token": "meta.xml-processing string"
		},
		{
			"foreground": "89bdff",
			"token": "meta.tag"
		},
		{
			"foreground": "89bdff",
			"token": "meta.tag entity"
		},
		{
			"foreground": "e0c589",
			"token": "source entity.name.tag"
		},
		{
			"foreground": "e0c589",
			"token": "source entity.other.attribute-name"
		},
		{
			"foreground": "e0c589",
			"token": "meta.tag.inline"
		},
		{
			"foreground": "e0c589",
			"token": "meta.tag.inline entity"
		},
		{
			"foreground": "e18964",
			"token": "entity.name.tag.namespace"
		},
		{
			"foreground": "e18964",
			"token": "entity.other.attribute-name.namespace"
		},
		{
			"foreground": "cda869",
			"token": "meta.selector.css entity.name.tag"
		},
		{
			"foreground": "8f9d6a",
			"token": "meta.selector.css entity.other.attribute-name.tag.pseudo-class"
		},
		{
			"foreground": "8b98ab",
			"token": "meta.selector.css entity.other.attribute-name.id"
		},
		{
			"foreground": "9b703f",
			"token": "meta.selector.css entity.other.attribute-name.class"
		},
		{
			"foreground": "c5af75",
			"token": "support.type.property-name.css"
		},
		{
			"foreground": "f9ee98",
			"token": "meta.property-group support.constant.property-value.css"
		},
		{
			"foreground": "f9ee98",
			"token": "meta.property-value support.constant.property-value.css"
		},
		{
			"foreground": "8693a5",
			"token": "meta.preprocessor.at-rule keyword.control.at-rule"
		},
		{
			"foreground": "dd7b3b",
			"token": "meta.property-value support.constant.named-color.css"
		},
		{
			"foreground": "dd7b3b",
			"token": "meta.property-value constant"
		},
		{
			"foreground": "8f9d6a",
			"token": "meta.constructor.argument.css"
		},
		{
			"foreground": "f8f8f8",
			"background": "0e2231",
			"fontStyle": "italic",
			"token": "meta.diff"
		},
		{
			"foreground": "f8f8f8",
			"background": "0e2231",
			"fontStyle": "italic",
			"token": "meta.diff.header"
		},
		{
			"foreground": "f8f8f8",
			"background": "420e09",
			"token": "markup.deleted"
		},
		{
			"foreground": "f8f8f8",
			"background": "4a410d",
			"token": "markup.changed"
		},
		{
			"foreground": "f8f8f8",
			"background": "253b22",
			"token": "markup.inserted"
		},
		{
			"foreground": "e9c062",
			"fontStyle": "italic",
			"token": "markup.italic"
		},
		{
			"foreground": "e9c062",
			"fontStyle": "bold",
			"token": "markup.bold"
		},
		{
			"foreground": "e18964",
			"fontStyle": "underline",
			"token": "markup.underline"
		},
		{
			"foreground": "e1d4b9",
			"background": "fee09c12",
			"fontStyle": "italic",
			"token": "markup.quote"
		},
		{
			"foreground": "fedcc5",
			"background": "632d04",
			"token": "markup.heading"
		},
		{
			"foreground": "fedcc5",
			"background": "632d04",
			"token": "markup.heading entity"
		},
		{
			"foreground": "e1d4b9",
			"token": "markup.list"
		},
		{
			"foreground": "578bb3",
			"background": "b1b3ba08",
			"token": "markup.raw"
		},
		{
			"foreground": "f67b37",
			"fontStyle": "italic",
			"token": "markup comment"
		},
		{
			"foreground": "60a633",
			"background": "242424",
			"token": "meta.separator"
		},
		{
			"background": "eeeeee29",
			"token": "meta.line.entry.logfile"
		},
		{
			"background": "eeeeee29",
			"token": "meta.line.exit.logfile"
		},
		{
			"background": "751012",
			"token": "meta.line.error.logfile"
		}
	],
	"colors": {
		"editor.foreground": "#F8F8F8",
		"editor.background": "#000000",
		"editor.selectionBackground": "#DDF0FF33",
		"editor.lineHighlightBackground": "#FFFFFF0D",
		"editorCursor.foreground": "#A7A7A7",
		"editorWhitespace.foreground": "#CAE2FB3D"
	}
} as Monaco.editor.IStandaloneThemeData

let tomorrowNightBlue = {
	"base": "vs-dark",
	"inherit": true,
	"rules": [
		{
			"background": "002451",
			"token": ""
		},
		{
			"foreground": "7285b7",
			"token": "comment"
		},
		{
			"foreground": "ffffff",
			"token": "keyword.operator.class"
		},
		{
			"foreground": "ffffff",
			"token": "keyword.operator"
		},
		{
			"foreground": "ffffff",
			"token": "constant.other"
		},
		{
			"foreground": "ffffff",
			"token": "source.php.embedded.line"
		},
		{
			"foreground": "ff9da4",
			"token": "variable"
		},
		{
			"foreground": "ff9da4",
			"token": "support.other.variable"
		},
		{
			"foreground": "ff9da4",
			"token": "string.other.link"
		},
		{
			"foreground": "ff9da4",
			"token": "string.regexp"
		},
		{
			"foreground": "ff9da4",
			"token": "entity.name.tag"
		},
		{
			"foreground": "ff9da4",
			"token": "entity.other.attribute-name"
		},
		{
			"foreground": "ff9da4",
			"token": "meta.tag"
		},
		{
			"foreground": "ff9da4",
			"token": "declaration.tag"
		},
		{
			"foreground": "ff9da4",
			"token": "markup.deleted.git_gutter"
		},
		{
			"foreground": "ffc58f",
			"token": "constant.numeric"
		},
		{
			"foreground": "ffc58f",
			"token": "constant.language"
		},
		{
			"foreground": "ffc58f",
			"token": "support.constant"
		},
		{
			"foreground": "ffc58f",
			"token": "constant.character"
		},
		{
			"foreground": "ffc58f",
			"token": "variable.parameter"
		},
		{
			"foreground": "ffc58f",
			"token": "punctuation.section.embedded"
		},
		{
			"foreground": "ffc58f",
			"token": "keyword.other.unit"
		},
		{
			"foreground": "ffeead",
			"token": "entity.name.class"
		},
		{
			"foreground": "ffeead",
			"token": "entity.name.type.class"
		},
		{
			"foreground": "ffeead",
			"token": "support.type"
		},
		{
			"foreground": "ffeead",
			"token": "support.class"
		},
		{
			"foreground": "d1f1a9",
			"token": "string"
		},
		{
			"foreground": "d1f1a9",
			"token": "constant.other.symbol"
		},
		{
			"foreground": "d1f1a9",
			"token": "entity.other.inherited-class"
		},
		{
			"foreground": "d1f1a9",
			"token": "markup.heading"
		},
		{
			"foreground": "d1f1a9",
			"token": "markup.inserted.git_gutter"
		},
		{
			"foreground": "99ffff",
			"token": "keyword.operator"
		},
		{
			"foreground": "99ffff",
			"token": "constant.other.color"
		},
		{
			"foreground": "bbdaff",
			"token": "entity.name.function"
		},
		{
			"foreground": "bbdaff",
			"token": "meta.function-call"
		},
		{
			"foreground": "bbdaff",
			"token": "support.function"
		},
		{
			"foreground": "bbdaff",
			"token": "keyword.other.special-method"
		},
		{
			"foreground": "bbdaff",
			"token": "meta.block-level"
		},
		{
			"foreground": "bbdaff",
			"token": "markup.changed.git_gutter"
		},
		{
			"foreground": "ebbbff",
			"token": "keyword"
		},
		{
			"foreground": "ebbbff",
			"token": "storage"
		},
		{
			"foreground": "ebbbff",
			"token": "storage.type"
		},
		{
			"foreground": "ebbbff",
			"token": "entity.name.tag.css"
		},
		{
			"foreground": "ffffff",
			"background": "f99da5",
			"token": "invalid"
		},
		{
			"foreground": "ffffff",
			"background": "bbdafe",
			"token": "meta.separator"
		},
		{
			"foreground": "ffffff",
			"background": "ebbbff",
			"token": "invalid.deprecated"
		},
		{
			"foreground": "ffffff",
			"token": "markup.inserted.diff"
		},
		{
			"foreground": "ffffff",
			"token": "markup.deleted.diff"
		},
		{
			"foreground": "ffffff",
			"token": "meta.diff.header.to-file"
		},
		{
			"foreground": "ffffff",
			"token": "meta.diff.header.from-file"
		},
		{
			"foreground": "718c00",
			"token": "markup.inserted.diff"
		},
		{
			"foreground": "718c00",
			"token": "meta.diff.header.to-file"
		},
		{
			"foreground": "c82829",
			"token": "markup.deleted.diff"
		},
		{
			"foreground": "c82829",
			"token": "meta.diff.header.from-file"
		},
		{
			"foreground": "ffffff",
			"background": "4271ae",
			"token": "meta.diff.header.from-file"
		},
		{
			"foreground": "ffffff",
			"background": "4271ae",
			"token": "meta.diff.header.to-file"
		},
		{
			"foreground": "3e999f",
			"fontStyle": "italic",
			"token": "meta.diff.range"
		}
	],
	"colors": {
		"editor.foreground": "#FFFFFF",
		"editor.background": "#002451",
		"editor.selectionBackground": "#003F8E",
		"editor.lineHighlightBackground": "#00346E",
		"editorCursor.foreground": "#FFFFFF",
		"editorWhitespace.foreground": "#404F7D"
	}
} as Monaco.editor.IStandaloneThemeData

let tomorrowNightBright = {
	"base": "vs-dark",
	"inherit": true,
	"rules": [
		{
			"background": "000000",
			"token": ""
		},
		{
			"foreground": "969896",
			"token": "comment"
		},
		{
			"foreground": "eeeeee",
			"token": "keyword.operator.class"
		},
		{
			"foreground": "eeeeee",
			"token": "constant.other"
		},
		{
			"foreground": "eeeeee",
			"token": "source.php.embedded.line"
		},
		{
			"foreground": "d54e53",
			"token": "variable"
		},
		{
			"foreground": "d54e53",
			"token": "support.other.variable"
		},
		{
			"foreground": "d54e53",
			"token": "string.other.link"
		},
		{
			"foreground": "d54e53",
			"token": "string.regexp"
		},
		{
			"foreground": "d54e53",
			"token": "entity.name.tag"
		},
		{
			"foreground": "d54e53",
			"token": "entity.other.attribute-name"
		},
		{
			"foreground": "d54e53",
			"token": "meta.tag"
		},
		{
			"foreground": "d54e53",
			"token": "declaration.tag"
		},
		{
			"foreground": "d54e53",
			"token": "markup.deleted.git_gutter"
		},
		{
			"foreground": "e78c45",
			"token": "constant.numeric"
		},
		{
			"foreground": "e78c45",
			"token": "constant.language"
		},
		{
			"foreground": "e78c45",
			"token": "support.constant"
		},
		{
			"foreground": "e78c45",
			"token": "constant.character"
		},
		{
			"foreground": "e78c45",
			"token": "variable.parameter"
		},
		{
			"foreground": "e78c45",
			"token": "punctuation.section.embedded"
		},
		{
			"foreground": "e78c45",
			"token": "keyword.other.unit"
		},
		{
			"foreground": "e7c547",
			"token": "entity.name.class"
		},
		{
			"foreground": "e7c547",
			"token": "entity.name.type.class"
		},
		{
			"foreground": "e7c547",
			"token": "support.type"
		},
		{
			"foreground": "e7c547",
			"token": "support.class"
		},
		{
			"foreground": "b9ca4a",
			"token": "string"
		},
		{
			"foreground": "b9ca4a",
			"token": "constant.other.symbol"
		},
		{
			"foreground": "b9ca4a",
			"token": "entity.other.inherited-class"
		},
		{
			"foreground": "b9ca4a",
			"token": "markup.heading"
		},
		{
			"foreground": "b9ca4a",
			"token": "markup.inserted.git_gutter"
		},
		{
			"foreground": "70c0b1",
			"token": "keyword.operator"
		},
		{
			"foreground": "70c0b1",
			"token": "constant.other.color"
		},
		{
			"foreground": "7aa6da",
			"token": "entity.name.function"
		},
		{
			"foreground": "7aa6da",
			"token": "meta.function-call"
		},
		{
			"foreground": "7aa6da",
			"token": "support.function"
		},
		{
			"foreground": "7aa6da",
			"token": "keyword.other.special-method"
		},
		{
			"foreground": "7aa6da",
			"token": "meta.block-level"
		},
		{
			"foreground": "7aa6da",
			"token": "markup.changed.git_gutter"
		},
		{
			"foreground": "c397d8",
			"token": "keyword"
		},
		{
			"foreground": "c397d8",
			"token": "storage"
		},
		{
			"foreground": "c397d8",
			"token": "storage.type"
		},
		{
			"foreground": "c397d8",
			"token": "entity.name.tag.css"
		},
		{
			"foreground": "ced2cf",
			"background": "df5f5f",
			"token": "invalid"
		},
		{
			"foreground": "ced2cf",
			"background": "82a3bf",
			"token": "meta.separator"
		},
		{
			"foreground": "ced2cf",
			"background": "b798bf",
			"token": "invalid.deprecated"
		},
		{
			"foreground": "ffffff",
			"token": "markup.inserted.diff"
		},
		{
			"foreground": "ffffff",
			"token": "markup.deleted.diff"
		},
		{
			"foreground": "ffffff",
			"token": "meta.diff.header.to-file"
		},
		{
			"foreground": "ffffff",
			"token": "meta.diff.header.from-file"
		},
		{
			"foreground": "718c00",
			"token": "markup.inserted.diff"
		},
		{
			"foreground": "718c00",
			"token": "meta.diff.header.to-file"
		},
		{
			"foreground": "c82829",
			"token": "markup.deleted.diff"
		},
		{
			"foreground": "c82829",
			"token": "meta.diff.header.from-file"
		},
		{
			"foreground": "ffffff",
			"background": "4271ae",
			"token": "meta.diff.header.from-file"
		},
		{
			"foreground": "ffffff",
			"background": "4271ae",
			"token": "meta.diff.header.to-file"
		},
		{
			"foreground": "3e999f",
			"fontStyle": "italic",
			"token": "meta.diff.range"
		}
	],
	"colors": {
		"editor.foreground": "#DEDEDE",
		"editor.background": "#000000",
		"editor.selectionBackground": "#424242",
		"editor.lineHighlightBackground": "#2A2A2A",
		"editorCursor.foreground": "#9F9F9F",
		"editorWhitespace.foreground": "#343434"
	}
} as Monaco.editor.IStandaloneThemeData

let tomorrowNightEighties = {
	"base": "vs-dark",
	"inherit": true,
	"rules": [
		{
			"background": "2D2D2D",
			"token": ""
		},
		{
			"foreground": "999999",
			"token": "comment"
		},
		{
			"foreground": "cccccc",
			"token": "keyword.operator.class"
		},
		{
			"foreground": "cccccc",
			"token": "constant.other"
		},
		{
			"foreground": "cccccc",
			"token": "source.php.embedded.line"
		},
		{
			"foreground": "f2777a",
			"token": "variable"
		},
		{
			"foreground": "f2777a",
			"token": "support.other.variable"
		},
		{
			"foreground": "f2777a",
			"token": "string.other.link"
		},
		{
			"foreground": "f2777a",
			"token": "entity.name.tag"
		},
		{
			"foreground": "f2777a",
			"token": "entity.other.attribute-name"
		},
		{
			"foreground": "f2777a",
			"token": "meta.tag"
		},
		{
			"foreground": "f2777a",
			"token": "declaration.tag"
		},
		{
			"foreground": "f2777a",
			"token": "markup.deleted.git_gutter"
		},
		{
			"foreground": "f99157",
			"token": "constant.numeric"
		},
		{
			"foreground": "f99157",
			"token": "constant.language"
		},
		{
			"foreground": "f99157",
			"token": "support.constant"
		},
		{
			"foreground": "f99157",
			"token": "constant.character"
		},
		{
			"foreground": "f99157",
			"token": "variable.parameter"
		},
		{
			"foreground": "f99157",
			"token": "punctuation.section.embedded"
		},
		{
			"foreground": "f99157",
			"token": "keyword.other.unit"
		},
		{
			"foreground": "ffcc66",
			"token": "entity.name.class"
		},
		{
			"foreground": "ffcc66",
			"token": "entity.name.type.class"
		},
		{
			"foreground": "ffcc66",
			"token": "support.type"
		},
		{
			"foreground": "ffcc66",
			"token": "support.class"
		},
		{
			"foreground": "99cc99",
			"token": "string"
		},
		{
			"foreground": "99cc99",
			"token": "constant.other.symbol"
		},
		{
			"foreground": "99cc99",
			"token": "entity.other.inherited-class"
		},
		{
			"foreground": "99cc99",
			"token": "markup.heading"
		},
		{
			"foreground": "99cc99",
			"token": "markup.inserted.git_gutter"
		},
		{
			"foreground": "66cccc",
			"token": "keyword.operator"
		},
		{
			"foreground": "66cccc",
			"token": "constant.other.color"
		},
		{
			"foreground": "6699cc",
			"token": "entity.name.function"
		},
		{
			"foreground": "6699cc",
			"token": "meta.function-call"
		},
		{
			"foreground": "6699cc",
			"token": "support.function"
		},
		{
			"foreground": "6699cc",
			"token": "keyword.other.special-method"
		},
		{
			"foreground": "6699cc",
			"token": "meta.block-level"
		},
		{
			"foreground": "6699cc",
			"token": "markup.changed.git_gutter"
		},
		{
			"foreground": "cc99cc",
			"token": "keyword"
		},
		{
			"foreground": "cc99cc",
			"token": "storage"
		},
		{
			"foreground": "cc99cc",
			"token": "storage.type"
		},
		{
			"foreground": "cc99cc",
			"token": "entity.name.tag.css"
		},
		{
			"foreground": "cdcdcd",
			"background": "f2777a",
			"token": "invalid"
		},
		{
			"foreground": "cdcdcd",
			"background": "99cccc",
			"token": "meta.separator"
		},
		{
			"foreground": "cdcdcd",
			"background": "cc99cc",
			"token": "invalid.deprecated"
		},
		{
			"foreground": "ffffff",
			"token": "markup.inserted.diff"
		},
		{
			"foreground": "ffffff",
			"token": "markup.deleted.diff"
		},
		{
			"foreground": "ffffff",
			"token": "meta.diff.header.to-file"
		},
		{
			"foreground": "ffffff",
			"token": "meta.diff.header.from-file"
		},
		{
			"foreground": "718c00",
			"token": "markup.inserted.diff"
		},
		{
			"foreground": "718c00",
			"token": "meta.diff.header.to-file"
		},
		{
			"foreground": "c82829",
			"token": "markup.deleted.diff"
		},
		{
			"foreground": "c82829",
			"token": "meta.diff.header.from-file"
		},
		{
			"foreground": "ffffff",
			"background": "4271ae",
			"token": "meta.diff.header.from-file"
		},
		{
			"foreground": "ffffff",
			"background": "4271ae",
			"token": "meta.diff.header.to-file"
		},
		{
			"foreground": "3e999f",
			"fontStyle": "italic",
			"token": "meta.diff.range"
		}
	],
	"colors": {
		"editor.foreground": "#CCCCCC",
		"editor.background": "#2D2D2D",
		"editor.selectionBackground": "#515151",
		"editor.lineHighlightBackground": "#393939",
		"editorCursor.foreground": "#CCCCCC",
		"editorWhitespace.foreground": "#6A6A6A"
	}
} as Monaco.editor.IStandaloneThemeData

let tomorrowNight = {
	"base": "vs-dark",
	"inherit": true,
	"rules": [
		{
			"background": "1D1F21",
			"token": ""
		},
		{
			"foreground": "969896",
			"token": "comment"
		},
		{
			"foreground": "ced1cf",
			"token": "keyword.operator.class"
		},
		{
			"foreground": "ced1cf",
			"token": "constant.other"
		},
		{
			"foreground": "ced1cf",
			"token": "source.php.embedded.line"
		},
		{
			"foreground": "cc6666",
			"token": "variable"
		},
		{
			"foreground": "cc6666",
			"token": "support.other.variable"
		},
		{
			"foreground": "cc6666",
			"token": "string.other.link"
		},
		{
			"foreground": "cc6666",
			"token": "string.regexp"
		},
		{
			"foreground": "cc6666",
			"token": "entity.name.tag"
		},
		{
			"foreground": "cc6666",
			"token": "entity.other.attribute-name"
		},
		{
			"foreground": "cc6666",
			"token": "meta.tag"
		},
		{
			"foreground": "cc6666",
			"token": "declaration.tag"
		},
		{
			"foreground": "cc6666",
			"token": "markup.deleted.git_gutter"
		},
		{
			"foreground": "de935f",
			"token": "constant.numeric"
		},
		{
			"foreground": "de935f",
			"token": "constant.language"
		},
		{
			"foreground": "de935f",
			"token": "support.constant"
		},
		{
			"foreground": "de935f",
			"token": "constant.character"
		},
		{
			"foreground": "de935f",
			"token": "variable.parameter"
		},
		{
			"foreground": "de935f",
			"token": "punctuation.section.embedded"
		},
		{
			"foreground": "de935f",
			"token": "keyword.other.unit"
		},
		{
			"foreground": "f0c674",
			"token": "entity.name.class"
		},
		{
			"foreground": "f0c674",
			"token": "entity.name.type.class"
		},
		{
			"foreground": "f0c674",
			"token": "support.type"
		},
		{
			"foreground": "f0c674",
			"token": "support.class"
		},
		{
			"foreground": "b5bd68",
			"token": "string"
		},
		{
			"foreground": "b5bd68",
			"token": "constant.other.symbol"
		},
		{
			"foreground": "b5bd68",
			"token": "entity.other.inherited-class"
		},
		{
			"foreground": "b5bd68",
			"token": "markup.heading"
		},
		{
			"foreground": "b5bd68",
			"token": "markup.inserted.git_gutter"
		},
		{
			"foreground": "8abeb7",
			"token": "keyword.operator"
		},
		{
			"foreground": "8abeb7",
			"token": "constant.other.color"
		},
		{
			"foreground": "81a2be",
			"token": "entity.name.function"
		},
		{
			"foreground": "81a2be",
			"token": "meta.function-call"
		},
		{
			"foreground": "81a2be",
			"token": "support.function"
		},
		{
			"foreground": "81a2be",
			"token": "keyword.other.special-method"
		},
		{
			"foreground": "81a2be",
			"token": "meta.block-level"
		},
		{
			"foreground": "81a2be",
			"token": "markup.changed.git_gutter"
		},
		{
			"foreground": "b294bb",
			"token": "keyword"
		},
		{
			"foreground": "b294bb",
			"token": "storage"
		},
		{
			"foreground": "b294bb",
			"token": "storage.type"
		},
		{
			"foreground": "b294bb",
			"token": "entity.name.tag.css"
		},
		{
			"foreground": "ced2cf",
			"background": "df5f5f",
			"token": "invalid"
		},
		{
			"foreground": "ced2cf",
			"background": "82a3bf",
			"token": "meta.separator"
		},
		{
			"foreground": "ced2cf",
			"background": "b798bf",
			"token": "invalid.deprecated"
		},
		{
			"foreground": "ffffff",
			"token": "markup.inserted.diff"
		},
		{
			"foreground": "ffffff",
			"token": "markup.deleted.diff"
		},
		{
			"foreground": "ffffff",
			"token": "meta.diff.header.to-file"
		},
		{
			"foreground": "ffffff",
			"token": "meta.diff.header.from-file"
		},
		{
			"foreground": "718c00",
			"token": "markup.inserted.diff"
		},
		{
			"foreground": "718c00",
			"token": "meta.diff.header.to-file"
		},
		{
			"foreground": "c82829",
			"token": "markup.deleted.diff"
		},
		{
			"foreground": "c82829",
			"token": "meta.diff.header.from-file"
		},
		{
			"foreground": "ffffff",
			"background": "4271ae",
			"token": "meta.diff.header.from-file"
		},
		{
			"foreground": "ffffff",
			"background": "4271ae",
			"token": "meta.diff.header.to-file"
		},
		{
			"foreground": "3e999f",
			"fontStyle": "italic",
			"token": "meta.diff.range"
		}
	],
	"colors": {
		"editor.foreground": "#C5C8C6",
		"editor.background": "#1D1F21",
		"editor.selectionBackground": "#373B41",
		"editor.lineHighlightBackground": "#282A2E",
		"editorCursor.foreground": "#AEAFAD",
		"editorWhitespace.foreground": "#4B4E55"
	}
} as Monaco.editor.IStandaloneThemeData

let tomorrow = {
	"base": "vs",
	"inherit": true,
	"rules": [
		{
			"background": "FFFFFF",
			"token": ""
		},
		{
			"foreground": "8e908c",
			"token": "comment"
		},
		{
			"foreground": "666969",
			"token": "keyword.operator.class"
		},
		{
			"foreground": "666969",
			"token": "constant.other"
		},
		{
			"foreground": "666969",
			"token": "source.php.embedded.line"
		},
		{
			"foreground": "c82829",
			"token": "variable"
		},
		{
			"foreground": "c82829",
			"token": "support.other.variable"
		},
		{
			"foreground": "c82829",
			"token": "string.other.link"
		},
		{
			"foreground": "c82829",
			"token": "string.regexp"
		},
		{
			"foreground": "c82829",
			"token": "entity.name.tag"
		},
		{
			"foreground": "c82829",
			"token": "entity.other.attribute-name"
		},
		{
			"foreground": "c82829",
			"token": "meta.tag"
		},
		{
			"foreground": "c82829",
			"token": "declaration.tag"
		},
		{
			"foreground": "c82829",
			"token": "markup.deleted.git_gutter"
		},
		{
			"foreground": "f5871f",
			"token": "constant.numeric"
		},
		{
			"foreground": "f5871f",
			"token": "constant.language"
		},
		{
			"foreground": "f5871f",
			"token": "support.constant"
		},
		{
			"foreground": "f5871f",
			"token": "constant.character"
		},
		{
			"foreground": "f5871f",
			"token": "variable.parameter"
		},
		{
			"foreground": "f5871f",
			"token": "punctuation.section.embedded"
		},
		{
			"foreground": "f5871f",
			"token": "keyword.other.unit"
		},
		{
			"foreground": "c99e00",
			"token": "entity.name.class"
		},
		{
			"foreground": "c99e00",
			"token": "entity.name.type.class"
		},
		{
			"foreground": "c99e00",
			"token": "support.type"
		},
		{
			"foreground": "c99e00",
			"token": "support.class"
		},
		{
			"foreground": "718c00",
			"token": "string"
		},
		{
			"foreground": "718c00",
			"token": "constant.other.symbol"
		},
		{
			"foreground": "718c00",
			"token": "entity.other.inherited-class"
		},
		{
			"foreground": "718c00",
			"token": "markup.heading"
		},
		{
			"foreground": "718c00",
			"token": "markup.inserted.git_gutter"
		},
		{
			"foreground": "3e999f",
			"token": "keyword.operator"
		},
		{
			"foreground": "3e999f",
			"token": "constant.other.color"
		},
		{
			"foreground": "4271ae",
			"token": "entity.name.function"
		},
		{
			"foreground": "4271ae",
			"token": "meta.function-call"
		},
		{
			"foreground": "4271ae",
			"token": "support.function"
		},
		{
			"foreground": "4271ae",
			"token": "keyword.other.special-method"
		},
		{
			"foreground": "4271ae",
			"token": "meta.block-level"
		},
		{
			"foreground": "4271ae",
			"token": "markup.changed.git_gutter"
		},
		{
			"foreground": "8959a8",
			"token": "keyword"
		},
		{
			"foreground": "8959a8",
			"token": "storage"
		},
		{
			"foreground": "8959a8",
			"token": "storage.type"
		},
		{
			"foreground": "ffffff",
			"background": "c82829",
			"token": "invalid"
		},
		{
			"foreground": "ffffff",
			"background": "4271ae",
			"token": "meta.separator"
		},
		{
			"foreground": "ffffff",
			"background": "8959a8",
			"token": "invalid.deprecated"
		},
		{
			"foreground": "ffffff",
			"token": "markup.inserted.diff"
		},
		{
			"foreground": "ffffff",
			"token": "markup.deleted.diff"
		},
		{
			"foreground": "ffffff",
			"token": "meta.diff.header.to-file"
		},
		{
			"foreground": "ffffff",
			"token": "meta.diff.header.from-file"
		},
		{
			"background": "718c00",
			"token": "markup.inserted.diff"
		},
		{
			"background": "718c00",
			"token": "meta.diff.header.to-file"
		},
		{
			"background": "c82829",
			"token": "markup.deleted.diff"
		},
		{
			"background": "c82829",
			"token": "meta.diff.header.from-file"
		},
		{
			"foreground": "ffffff",
			"background": "4271ae",
			"token": "meta.diff.header.from-file"
		},
		{
			"foreground": "ffffff",
			"background": "4271ae",
			"token": "meta.diff.header.to-file"
		},
		{
			"foreground": "3e999f",
			"fontStyle": "italic",
			"token": "meta.diff.range"
		}
	],
	"colors": {
		"editor.foreground": "#4D4D4C",
		"editor.background": "#FFFFFF",
		"editor.selectionBackground": "#D6D6D6",
		"editor.lineHighlightBackground": "#EFEFEF",
		"editorCursor.foreground": "#AEAFAD",
		"editorWhitespace.foreground": "#D1D1D1"
	}
} as Monaco.editor.IStandaloneThemeData

let twilight = {
	"base": "vs-dark",
	"inherit": true,
	"rules": [
		{
			"background": "141414",
			"token": ""
		},
		{
			"foreground": "5f5a60",
			"fontStyle": "italic",
			"token": "comment"
		},
		{
			"foreground": "cf6a4c",
			"token": "constant"
		},
		{
			"foreground": "9b703f",
			"token": "entity"
		},
		{
			"foreground": "cda869",
			"token": "keyword"
		},
		{
			"foreground": "f9ee98",
			"token": "storage"
		},
		{
			"foreground": "8f9d6a",
			"token": "string"
		},
		{
			"foreground": "9b859d",
			"token": "support"
		},
		{
			"foreground": "7587a6",
			"token": "variable"
		},
		{
			"foreground": "d2a8a1",
			"fontStyle": "italic underline",
			"token": "invalid.deprecated"
		},
		{
			"foreground": "f8f8f8",
			"background": "562d56bf",
			"token": "invalid.illegal"
		},
		{
			"background": "b0b3ba14",
			"token": "text source"
		},
		{
			"background": "b1b3ba21",
			"token": "text.html.ruby source"
		},
		{
			"foreground": "9b5c2e",
			"fontStyle": "italic",
			"token": "entity.other.inherited-class"
		},
		{
			"foreground": "daefa3",
			"token": "string source"
		},
		{
			"foreground": "ddf2a4",
			"token": "string constant"
		},
		{
			"foreground": "e9c062",
			"token": "string.regexp"
		},
		{
			"foreground": "cf7d34",
			"token": "string.regexp constant.character.escape"
		},
		{
			"foreground": "cf7d34",
			"token": "string.regexp source.ruby.embedded"
		},
		{
			"foreground": "cf7d34",
			"token": "string.regexp string.regexp.arbitrary-repitition"
		},
		{
			"foreground": "8a9a95",
			"token": "string variable"
		},
		{
			"foreground": "dad085",
			"token": "support.function"
		},
		{
			"foreground": "cf6a4c",
			"token": "support.constant"
		},
		{
			"foreground": "8996a8",
			"token": "meta.preprocessor.c"
		},
		{
			"foreground": "afc4db",
			"token": "meta.preprocessor.c keyword"
		},
		{
			"foreground": "494949",
			"token": "meta.tag.sgml.doctype"
		},
		{
			"foreground": "494949",
			"token": "meta.tag.sgml.doctype entity"
		},
		{
			"foreground": "494949",
			"token": "meta.tag.sgml.doctype string"
		},
		{
			"foreground": "494949",
			"token": "meta.tag.preprocessor.xml"
		},
		{
			"foreground": "494949",
			"token": "meta.tag.preprocessor.xml entity"
		},
		{
			"foreground": "494949",
			"token": "meta.tag.preprocessor.xml string"
		},
		{
			"foreground": "ac885b",
			"token": "declaration.tag"
		},
		{
			"foreground": "ac885b",
			"token": "declaration.tag entity"
		},
		{
			"foreground": "ac885b",
			"token": "meta.tag"
		},
		{
			"foreground": "ac885b",
			"token": "meta.tag entity"
		},
		{
			"foreground": "e0c589",
			"token": "declaration.tag.inline"
		},
		{
			"foreground": "e0c589",
			"token": "declaration.tag.inline entity"
		},
		{
			"foreground": "e0c589",
			"token": "source entity.name.tag"
		},
		{
			"foreground": "e0c589",
			"token": "source entity.other.attribute-name"
		},
		{
			"foreground": "e0c589",
			"token": "meta.tag.inline"
		},
		{
			"foreground": "e0c589",
			"token": "meta.tag.inline entity"
		},
		{
			"foreground": "cda869",
			"token": "meta.selector.css entity.name.tag"
		},
		{
			"foreground": "8f9d6a",
			"token": "meta.selector.css entity.other.attribute-name.tag.pseudo-class"
		},
		{
			"foreground": "8b98ab",
			"token": "meta.selector.css entity.other.attribute-name.id"
		},
		{
			"foreground": "9b703f",
			"token": "meta.selector.css entity.other.attribute-name.class"
		},
		{
			"foreground": "c5af75",
			"token": "support.type.property-name.css"
		},
		{
			"foreground": "f9ee98",
			"token": "meta.property-group support.constant.property-value.css"
		},
		{
			"foreground": "f9ee98",
			"token": "meta.property-value support.constant.property-value.css"
		},
		{
			"foreground": "8693a5",
			"token": "meta.preprocessor.at-rule keyword.control.at-rule"
		},
		{
			"foreground": "ca7840",
			"token": "meta.property-value support.constant.named-color.css"
		},
		{
			"foreground": "ca7840",
			"token": "meta.property-value constant"
		},
		{
			"foreground": "8f9d6a",
			"token": "meta.constructor.argument.css"
		},
		{
			"foreground": "f8f8f8",
			"background": "0e2231",
			"fontStyle": "italic",
			"token": "meta.diff"
		},
		{
			"foreground": "f8f8f8",
			"background": "0e2231",
			"fontStyle": "italic",
			"token": "meta.diff.header"
		},
		{
			"foreground": "f8f8f8",
			"background": "0e2231",
			"fontStyle": "italic",
			"token": "meta.separator"
		},
		{
			"foreground": "f8f8f8",
			"background": "420e09",
			"token": "markup.deleted"
		},
		{
			"foreground": "f8f8f8",
			"background": "4a410d",
			"token": "markup.changed"
		},
		{
			"foreground": "f8f8f8",
			"background": "253b22",
			"token": "markup.inserted"
		},
		{
			"foreground": "f9ee98",
			"token": "markup.list"
		},
		{
			"foreground": "cf6a4c",
			"token": "markup.heading"
		}
	],
	"colors": {
		"editor.foreground": "#F8F8F8",
		"editor.background": "#141414",
		"editor.selectionBackground": "#DDF0FF33",
		"editor.lineHighlightBackground": "#FFFFFF08",
		"editorCursor.foreground": "#A7A7A7",
		"editorWhitespace.foreground": "#FFFFFF40"
	}
} as Monaco.editor.IStandaloneThemeData

loader.init().then((monaco: any) => {
	monaco.editor.defineTheme("all-hallows-eve", allHallowsEve)
	monaco.editor.defineTheme("amy", amy)
	monaco.editor.defineTheme("birds-of-paradise", birdsOfParadise)
	monaco.editor.defineTheme("blackboard", blackboard)
	monaco.editor.defineTheme("brilliance-black", brillianceBlack)
	monaco.editor.defineTheme("brilliance-dull", brillianceDull)
	monaco.editor.defineTheme("chrome-dev-tools", chromeDevTools)
	monaco.editor.defineTheme("clouds-midnight", cloudsMidnight)
	monaco.editor.defineTheme("clouds", clouds)
	monaco.editor.defineTheme("cobalt", cobalt)
	monaco.editor.defineTheme("dracula", dracula)
	monaco.editor.defineTheme("dreamweaver", dreamweaver)
	monaco.editor.defineTheme("espresso-libre", espressoLibre)
	monaco.editor.defineTheme("github-dark", githubDark)
	monaco.editor.defineTheme("github-light", githubLight)
	monaco.editor.defineTheme("github", github)
	monaco.editor.defineTheme("merbivore-soft", merbivoreSoft)
	monaco.editor.defineTheme("monokai", monokai)
	monaco.editor.defineTheme("night-owl", nightOwl)
	monaco.editor.defineTheme("nord", nord)
	monaco.editor.defineTheme("oceanic-next", oceanicNext)
	monaco.editor.defineTheme("pastels-on-dark", pastelsOnDark)
	monaco.editor.defineTheme("sunburst", sunburst)
	monaco.editor.defineTheme("tomorrow-night-blue", tomorrowNightBlue)
	monaco.editor.defineTheme("tomorrow-night-bright", tomorrowNightBright)
	monaco.editor.defineTheme("tomorrow-night-eighties", tomorrowNightEighties)
	monaco.editor.defineTheme("tomorrow-night", tomorrowNight)
	monaco.editor.defineTheme("tomorrow", tomorrow)
	monaco.editor.defineTheme("twilight", twilight)
})
