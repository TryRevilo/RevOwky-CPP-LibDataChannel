package rev.ca.rev_gen_lib_pers.RevDBModels;

import java.util.List;

public class REV_PERS_REVMETADATA_GEN_FUNCTIONS {

    public static String REV_GET_METADATA_VALUE(List<RevEntityMetadata> revEntityMetadataList, String revMetadataName) {
        String revMetadataValue = "";

        if (revEntityMetadataList == null) return revMetadataValue;

        for (RevEntityMetadata revEntityMetadata : revEntityMetadataList) {
            if (revEntityMetadata != null && revEntityMetadata.get_revMetadataName() != null && revEntityMetadata.get_revMetadataName().equals(revMetadataName)) {
                revMetadataValue = revEntityMetadata.get_metadataValue();
                break;
            }
        }

        return revMetadataValue;
    }

    public static void REV_RESET_METADATA_VALUE(RevEntity revEntity, String revMetadataName, String newValue) {
        List<RevEntityMetadata> revEntityMetadataList = revEntity.get_revEntityMetadataList();

        if (revEntityMetadataList == null) return;

        for (int i = 0; i < revEntityMetadataList.size(); i++) {
            if (revEntityMetadataList.get(i).get_revMetadataName().equals(revMetadataName)) {
                revEntity.get_revEntityMetadataList().get(i).set_metadataValue(newValue);
                break;
            }

            if (i == (revEntityMetadataList.size() - 1)) {
                revEntity.get_revEntityMetadataList().add(new RevEntityMetadata(revMetadataName, newValue));
            }
        }
    }
}
