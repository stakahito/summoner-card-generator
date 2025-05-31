import { useState, useEffect } from "react";
import Input from "./Input";
import CardCanvas from "./components/CardCanvas";
import "./App.css"

const toKana = (search) => search.replace(/[\u3041-\u3096]/g, ch =>
  String.fromCharCode(ch.charCodeAt(0) + 0x60)
);

const templates = [
  { name: "theme1", url: "./templates/template1.jpg", stroke: "#00C198" },
  { name: "theme2", url: "./templates/template2.jpg", stroke: "#2196F3" },
  { name: "theme3", url: "./templates/template3.jpg", stroke: "#e87fa3" },
  { name: "theme4", url: "./templates/template4.jpg", stroke: "#4d698e" },
];

export default function App() {
  const [form, setForm] = useState({
    name: "",
    gender: "",
    rankAndHistory: "",
    weekday: "",
    weekend: "",
    roles: [],
    vc: "",
    champions: [],
    free: "",
  });
  const [templateIndex, setTemplateIndex] = useState(0);

  const [champions, setChampions] = useState([]);
  const [champSearch, setChampSearch] = useState("");

  useEffect(() => {
    fetch("https://ddragon.leagueoflegends.com/cdn/14.10.1/data/ja_JP/champion.json")
      .then((res) => res.json())
      .then((data) => {
        const list = Object.values(data.data).map((champ) => ({
          id: champ.id,
          name: champ.name,
          image: `https://ddragon.leagueoflegends.com/cdn/14.10.1/img/champion/${champ.id}.png`,
        }));
        setChampions(list);
      });
  }, []);

  const championsFiltered = champions.filter(c =>
    c.id.toLowerCase().includes(champSearch.toLowerCase()) ||
    c.name.includes(champSearch) ||
    c.name.includes(toKana(champSearch))
  );

  const ROLES = ["TOP", "JG", "MID", "ADC", "SUP"];
  const VCS = ["Discord", "聞き専", "なし"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-green-100 to-purple-100 p-2 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4 mt-4 drop-shadow">サモナーカード ジェネレーター</h1>
      <div className="max-w-6xl w-full bg-white rounded-2xl shadow-xl p-6 flex flex-col md:flex-row gap-6">
        {/* 入力欄 */}
        <div className="flex-1 md:basis-1/3 md:max-w-[360px]">
          <div>
            <p className="font-semibold">テーマ選択</p>
            <div className="flex flex-wrap gap-2">
              {templates.map((template, i) => (
                <button
                  key={template.name}
                  onClick={() => setTemplateIndex(i)}
                  className={`rounded-full px-4 py-1 text-sm border ${i === templateIndex ? "bg-blue-300 font-bold" : "bg-gray-100"
                    } hover:shadow transition`}
                >
                  {template.name}
                </button>
              ))}
            </div>
          </div>
          <Input label="サモナーネーム" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} />
          <Input label="性別" value={form.gender} onChange={v => setForm(f => ({ ...f, gender: v }))} />
          <Input label="レート・LOL歴" value={form.rankAndHistory} onChange={v => setForm(f => ({ ...f, rankAndHistory: v }))} />
          <Input label="時間帯(平日)" value={form.weekday} onChange={v => setForm(f => ({ ...f, weekday: v }))} />
          <Input label="時間帯(休日)" value={form.weekend} onChange={v => setForm(f => ({ ...f, weekend: v }))} />
          <div>
            <p className="font-semibold">レーン（複数可）</p>
            <div className="flex flex-wrap gap-2">
              {ROLES.map(role => (
                <button
                  key={role}
                  onClick={() =>
                    setForm(f => ({
                      ...f,
                      roles: f.roles.includes(role)
                        ? f.roles.filter(l => l !== role)
                        : [...f.roles, role],
                    }))
                  }
                  className={`rounded-full px-4 py-1 text-sm border ${form.roles.includes(role) ? "bg-green-300 font-bold" : "bg-gray-100"
                    } hover:shadow transition`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="font-semibold">VC</p>
            <div className="flex gap-2">
              {VCS.map(vc => (
                <button
                  key={vc}
                  onClick={() => setForm(f => ({ ...f, vc }))}
                  className={`rounded-full px-4 py-1 text-sm border ${form.vc === vc ? "bg-blue-300 font-bold" : "bg-gray-100"
                    } hover:shadow transition`}
                >
                  {vc}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="font-semibold">フリースペース</p>
            <textarea
              value={form.free}
              onChange={e => setForm(f => ({ ...f, free: e.target.value }))}
              className="w-full min-h-[60px] border rounded-lg p-2 focus:outline-blue-300"
              placeholder=""
            />
          </div>
        </div>
        {/* チャンピオン選択・プレビュー */}
        <div className="flex-[2] md:basis-2/3 min-w-0">
          <div className="bg-slate-50 rounded-xl p-4 shadow">
            <p className="font-semibold mb-2">得意チャンピオン（最大9体）</p>
            <input
              value={champSearch}
              onChange={e => setChampSearch(e.target.value)}
              placeholder="検索"
              className="border rounded px-2 py-1 w-full mb-2"
            />
            <div className="
              grid
              grid-cols-4
              sm:grid-cols-5
              md:grid-cols-6
              lg:grid-cols-8
              xl:grid-cols-9
              gap-2
              place-items-center
              max-h-56
              overflow-y-auto
            ">
              {championsFiltered.map(champ => (
                <button
                  key={champ.id}
                  onClick={() => {
                    setForm(f =>
                      f.champions.includes(champ.id) || f.champions.length >= 9
                        ? { ...f, champions: f.champions.filter(v => v !== champ.id) }
                        : { ...f, champions: [...f.champions, champ.id] }
                    );
                  }}
                  className={`flex flex-col items-center px-2 py-1 rounded-lg ${form.champions.includes(champ.id) ? "bg-blue-200" : "bg-gray-100"
                    } hover:shadow transition`}
                  disabled={form.champions.length >= 9}
                >
                  <img src={champ.image} alt={champ.id} className="w-12 h-12 rounded-lg my-1" />
                  <span className="text-xs">{champ.jp}</span>
                </button>
              ))}
            </div>
            <div className="text-right text-xs mt-1">
              {form.champions.length} / 9 選択中
            </div>
          </div>
          {/* サンプル：カードプレビュー */}
          <div className="bg-white rounded-xl p-4 shadow-md flex flex-col items-center">
            <CardCanvas formData={form} templateUrl={templates[templateIndex].url} strokeColor={templates[templateIndex].stroke} />
          </div>
        </div>
      </div>
    </div>
  );
}
