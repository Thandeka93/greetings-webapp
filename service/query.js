export default async function makeQuery(db){
   
   const insert = async function (username){
         await db.none('INSERT INTO users(user_name , user_counter) VALUES ($1,$2)',[username,1]);
    }

    const bring = async function(){
       return await db.query('SELECT DISTINCT user_name FROM users');
    }

    const peopleCount = async function(){
       return await db.oneOrNone('SELECT COUNT(DISTINCT user_name) FROM users');
    }

    const reset = async function(){
        await db.none(' DELETE FROM users');
    }

    const countGreetedUsers = async function(username){
       return await db.oneOrNone('SELECT SUM(user_counter) FROM users WHERE user_name = $1',[username]);
    }
 
    return{
      insert,
      bring,
      peopleCount,
      reset,
      countGreetedUsers  
    }
}

