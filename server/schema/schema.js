const graphql = require("graphql");
const _ = require("lodash");

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList
} = graphql;

// Dummy data
const dummy_students = [
    {
        name: "Student-1",
        class: "Tenth",
        id: "1",
        school_id: "1",
    }, {
        name: "Student-2",
        class: "Fourth",
        id: "2",
        school_id: "1",
    }, {
        name: "Student-3",
        class: "Fifth",
        id: "3",
        school_id: "3",
    },
]

const dummy_schools = [
    {
        name: "School-1",
        total_students: 21,
        id: "1"
    }, {
        name: "School-2",
        total_students: 43,
        id: "2"
    }, {
        name: "School-3",
        total_students: 72,
        id: "3"
    },
]

const StudentType = new GraphQLObjectType({
    name: "Student",
    // fields: () => has to be function because of Chicken Egg issue with StudentType and SchoolType.
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        class: { type: GraphQLString },
        school: {
            type: SchoolType, resolve(parent, args) {
                return _.find(dummy_schools, { id: parent.school_id });
            }
        }
    })
})

const SchoolType = new GraphQLObjectType({
    name: "School",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        total_students: { type: GraphQLInt },
        students: {
            type: new GraphQLList(StudentType), resolve(parent, args) {
                return _.filter(dummy_students, { school_id: parent.id })
            }
        }
    })
})

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    // No chicken egg issue would occur here. So, It don't need to be a function. 
    fields: {
        student: {
            type: StudentType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                //code to get data from database
                return _.find(dummy_students, { id: args.id })
            }
        },
        school: {
            type: SchoolType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                //code to get data from database
                return _.find(dummy_schools, { id: args.id })
            }
        },
        students: {
            type: new GraphQLList(StudentType),
            resolve(parent, args) {
                //code to get data from database
                return dummy_students;
            }
        },
        schools: {
            type: new GraphQLList(SchoolType),
            resolve(parent, arg) {
                //code to get data from database
                return dummy_schools;
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery
})