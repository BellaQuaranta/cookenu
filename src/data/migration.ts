import { BaseDataBase } from "./BaseDataBase";


export async function Migration() {
    // await BaseDataBase.connection.raw(`
    // CREATE TABLE cookenu_followers(
    //     id VARCHAR(255) PRIMARY KEY,
    //     id_following VARCHAR(255) NOT NULL,
    //     id_followed VARCHAR(255) NOT NULL,
    //     FOREIGN KEY (id_following) REFERENCES cookenu_users(id),
    //     FOREIGN KEY (id_followed) REFERENCES cookenu_users(id)
    // );
// `)

    console.log("Tabelas criadas!")
}
