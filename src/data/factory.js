import initMongoDB from "./mongo/mongoDB";

let persitance = process.argv[2];

switch (persitance) {
    case 'mongo':
        initMongoDB();
        break;
    case 'file':
        initFileDB();
        break;
    default:
        initMongoDB();
        console.log8("inited to default MongoDB");
        break;
}