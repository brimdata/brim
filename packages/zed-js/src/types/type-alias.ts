import * as zjson from '../zjson';
import { DecodeStream } from '../decode-stream';
import { EncodeStream } from '../encode-stream';
import { Field } from '../values/field';
import { Value } from '../values/types';
import { TypeRecord } from './type-record';
import { Type } from './types';

export class TypeAlias implements Type {
  kind = 'alias';

  constructor(public name: string, public type: Type) {}

  static stringify(name: string, type: Type) {
    console.log('I am in the TypeAlias stringify. name = ' + name);
    return name + '=(' + type.toString() + ')';
  }

  create(value: zjson.Value, stream: DecodeStream, parent?: Field) {
    let v: Value;
    if (this.type instanceof TypeRecord || this.type instanceof TypeAlias) {
      v = this.type.create(value as zjson.RecordValue, stream, parent);
    } else {
      v = this.type.create(value, stream);
    }
    v.type = this; // a better way to do this?
    return v;
  }

  serialize(stream: EncodeStream): zjson.NoId<zjson.NamedType> {
    return {
      kind: 'named',
      name: this.name,
      type: stream.encodeType(this.type),
    };
  }

  toString() {
    console.log('I am in the TypeAlias toString');
    return this.name + '=' + this.type.toString();
  }
}
