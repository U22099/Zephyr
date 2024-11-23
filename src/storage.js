const init = (version = 1) => {
    const opendb = indexedDB.open("Lumina", version);
    opendb.onupgradeneeded = (event) => {
        const db = event.target.result;
        db.createObjectStore("all_users_data");
        db.createObjectStore("chat_collection");
        db.createObjectStore("user_data");
        db.createObjectStore("posts");
    }
    return opendb;
}
const saveData = (data, objStore, key = 1) => {
    const request = init(2);
    request.onsuccess = event => {
        const db = event.target.result;
        const transaction = db.transaction(objStore, 'readwrite');
        const store = transaction.objectStore(objStore);
        store.put(data, key);
        transaction.oncomplete = () => {
            db.close();
        }
    }
}
const getData = (objStore, key = 1) => {
    const request = init(2);
    return new Promise(resolve => {
        request.onsuccess = event => {
            const db = event.target.result;
            const transaction = db.transaction(objStore, 'readonly');
            const store = transaction.objectStore(objStore);
            const result = store.get(key);
            result.onsuccess = () => {
                resolve(result.result);
            }
            transaction.oncomplete = () => {
                db.close();
            }
        }
    });
}


export default { saveData, getData }
