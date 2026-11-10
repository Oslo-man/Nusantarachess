import { callGlobal, hideImgInvisible } from "../../components/dom-handlers";

export interface CharacterCardData {
  id: string;
  name: string;
  elo?: number;
  image?: string;
  selected?: boolean;
}

export function CharacterCard({ id, name, elo, image, selected = false }: CharacterCardData) {
  return (
    <button
      type="button"
      className={selected ? "character-card is-selected" : "character-card"}
      data-character={id}
      role="radio"
      aria-checked={selected ? "true" : "false"}
      onClick={() => callGlobal("UISelectCharacterCard", id)}
    >
      <span className="character-card-avatar">
        <img src={"images/" + (image || id) + ".svg"} alt="" onError={hideImgInvisible} />
      </span>
      <span className="character-card-name">{name}</span>
      <span className="character-card-elo">{elo != null ? elo + " Elo" : "Elo segera"}</span>
      <span className="character-card-check" aria-hidden="true"><span className="ui-ico ui-ico-check" aria-hidden="true" /></span>
    </button>
  );
}
