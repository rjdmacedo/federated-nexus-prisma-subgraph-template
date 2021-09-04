import { asNexusMethod } from 'nexus';
import { DateTimeResolver } from 'graphql-scalars';

export const DateTime = asNexusMethod(DateTimeResolver, 'date');
