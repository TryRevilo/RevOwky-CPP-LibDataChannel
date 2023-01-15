package rev.ca.rev_gen_lib_pers.RevDBModels.rev_entity_subtypes;

import rev.ca.rev_gen_lib_pers.RevDBModels.RevEntity;

/**
 * Created by rev on 1/1/18.
 */

public class RevGroupEntity extends RevEntity {
    public RevGroupEntity() {
    }

    private String name = "";
    private String description = "";

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
