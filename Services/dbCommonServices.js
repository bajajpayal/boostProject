var Models =  require('../Models');

exports.insertData = function(model,data,callback)
{
    new Models[model](data).save(callback);
};

exports.getData = function(model,criteria,options,projection,callback)
{
    console.log("getdattataattata")
    Models[model].find(criteria, projection).lean().exec((err,data)=>
{
    callback(err,data);

})
}

exports.findOneAndUpdateData = function (model , criteria , query , options , callback)
{
    Models[model].findOneAndUpdate(criteria , query , options,(err,d)=>
{
    console.log(err,d)
    callback(err,d);
})
}