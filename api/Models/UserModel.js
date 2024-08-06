import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar:{
        type: String,
        default:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALEAAACUCAMAAADrljhyAAAAMFBMVEXk5ueutLeor7Le4eLn6eqrsbWxt7rS1te5vsHN0NLGysza3d7Cxsjq7O3Jzc++w8Ur8tTWAAAEKUlEQVR4nO2c627rIAyAEzC3kMv7v+2BJN1anS4FTGw28f3p1G3SJ8sBc3GGodPpdDqdTqfT6XQ6nT8IRLglEome0rg1YIw8v2gXGLyZ7SiEUIHwMdrJ+HalF+msVmp8JojrzckmnWGY9fiq+7Ae9dRgVstJvNU9pcXaVpxhcPrCNyK0ayjOIO217hHnuZkwg/kU4FNZ+0aUXZLvnhqG2zUCU7JwUHb8Uc4SDvArZwqPYuX1hTVTOOYyZ5TBiFzhAOOIAVIXCI9WshkPNjsnImJjE3YlviNjKstC4QCP8bIV5URETSzKvmScONGeQRhS6rUfmRiEPUZ41PQjHMzFWRwRjty4bPJ4CjK5sUGFOASZ/NnDJUVcQ1EPcIih7YTYGDMYn0GmTYvclcc7aFcjC3KkiGykxoAP8WgphQeJf/BoawvAjsaHMWFaQPqmygWUdT1MFYQV5WABcw3jldJ468bd+A8Y/76xYq1gTFoK1ZnzSGcQ/9tm6UHWMCbdAFh+XbW5oDaEDmiXphWKN0W8JYsv6QX1PhZ6oacXYmPsYpp0jt5B72LRb26Wndp8hZj+9AZZWiiGM3XcdizHmR5qy5v+uduVEca0M/SX8Vo8i7AdQZYOF8pSzx4nYEpjzHaUXnC7Yg8x/TnTN0V5wXf0PxSWcJzCw1BwcsorHCqiPN0GbunlbgSw3mt6KGfksmKPcAR82rXNMS74WxCOV7LmpDCrmfES1iswuPe3u19827hm+gDkh7lEqa2ZAB/AYuzPcVaj9UzFzwUwmFm9y+fw5Wza7LCAQTotXhsAlBDWyTZ9dwDATFbrfQ0YPvTUaHRfgAWk98Z7L8OP3Daf2XuwlpPG+7GiofTGTfNsD+Z5cs74/Tfcds/EMAbTdQtP3dGD9TQKq/07HRuy5PGn3AB8yV5NIdE8aDsjeaVhkWa2elRplVDsI7OxkYxLOkwZBcu88B96YijhwmRhNlG6w6KEXT2pdYjupC/zNiHUhH2GsMRWR4zu6UyWHQm1cLL1/TU+xFqnlm9UHqeb75A5W9N3d74zNxb/Q+srlvWeah/kVju+D9Qd1wsBPva+oqieGjDUuOF2gbJ1N4syNlGKlceahzng7srgZ4StlRkwTBTCsQm81q5cecdVJqrKZSeQt6fwExWOzWiFKyh/3E+rD/LeHr0wdhefNiUOUIlxWyVxTfEgV6OxpojSyxflx85Y1FwmjGvLRCGKagxgGCa+lQtKjDpNKqUom2+M7SPFkj+RYLsyseQupDgfu4Ps21rcIQ7KecI1+u+QiDlnTwDx2oSKylkx5g9xXocL71j8Rc7FQ+ax+EF62enbME5/kwiUvhGmMhm3qvkH44PkeS/p/XIUJF8EbySN09/6VfayqztIXouQ7AsmkToicy1I/yf1ZS1WNEOisWyGd6PbP6wPORpvXJVYAAAAAElFTkSuQmCC"
    },
    
}, { timestamps: true});

const User = mongoose.model('User', userSchema);

export default User;    