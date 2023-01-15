package rev.ca.rev_gen_lib_pers.rev_server_client;

import com.google.gson.Gson;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import rev.ca.rev_gen_lib_pers.RevDBModels.RevAnnotation;
import rev.ca.rev_gen_lib_pers.RevDBModels.RevEntity;
import rev.ca.rev_gen_lib_pers.RevDBModels.RevEntityMetadata;

public class RevJSONEntityClassConstructor {

    Gson gson = new Gson();

    private RevEntity revPublisherEntity;
    private Map<Long, RevEntity> revEntityPublishers;

    public RevJSONEntityClassConstructor() {
    }

    public RevJSONEntityClassConstructor(RevEntity revPublisherEntity) {
        this.revPublisherEntity = revPublisherEntity;
    }

    public RevJSONEntityClassConstructor(Map<Long, RevEntity> revEntityPublishers) {
        this.revEntityPublishers = revEntityPublishers;
    }

    public RevEntity getClassRevEntity_From_JSON(JSONObject jsonObject) {
        if (jsonObject == null
                || jsonObject.length() == 0
                || !jsonObject.has("_revEntityType")
                || !jsonObject.has("_revEntitySubType"))
            return null;

        RevEntity revEntity = gson.fromJson(jsonObject.toString(), RevEntity.class);

        if (revPublisherEntity != null) revEntity.set_revPublisherEntity(revPublisherEntity);

        if (revEntityPublishers != null) {
            revEntity.set_revPublisherEntity(revEntityPublishers.get(revEntity.get_revEntityOwnerGUID()));
        }

        revEntity.set_fromRemote(true);

        try {
            revEntity.set_revEntityMetadataList(this.setRevMetadata(jsonObject.getJSONArray("_revEntityMetadataList")));
            revEntity.set_revAnnotations(this.setRevAnnotationsList(jsonObject.getJSONArray("_revEntityAnnotations")));
        } catch (JSONException e) {
            e.printStackTrace();
        }

        if (jsonObject.has("_revEntityChildrenList")) {
            try {
                JSONArray revChildrenJSONArray = jsonObject.getJSONArray("_revEntityChildrenList");

                for (int i = 0; i < revChildrenJSONArray.length(); i++) {
                    RevEntity revChildEntity;

                    if (revEntityPublishers != null) {
                        revChildEntity = new RevJSONEntityClassConstructor(revEntityPublishers).getClassRevEntity_From_JSON(revChildrenJSONArray.getJSONObject(i));
                    } else {
                        revChildEntity = new RevJSONEntityClassConstructor().getClassRevEntity_From_JSON(revChildrenJSONArray.getJSONObject(i));
                    }

                    if (revChildEntity == null) continue;

                    revChildEntity.set_revEntityMetadataList(this.setRevMetadata(revChildrenJSONArray.getJSONObject(i).getJSONArray("_revEntityMetadataList")));

                    List<RevEntity> revEntityChildrenList = revEntity.get_revEntityChildrenList();

                    if (revEntityChildrenList != null) {
                        revEntity.get_revEntityChildrenList().add(revChildEntity);
                    } else {
                        revEntity.set_revEntityChildrenList(new ArrayList<>(Arrays.asList(revChildEntity)));
                    }
                }
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }

        return revEntity;
    }

    private List<RevEntityMetadata> setRevMetadata(JSONArray revEntityMetadataJSONArray) {
        List<RevEntityMetadata> revEntityMetadataList = new ArrayList<>();

        for (int i = 0; i < revEntityMetadataJSONArray.length(); i++) {
            JSONObject revEntityMetadataJSON = null;
            try {
                revEntityMetadataJSON = revEntityMetadataJSONArray.getJSONObject(i);
            } catch (JSONException e) {
                e.printStackTrace();
            }
            if (revEntityMetadataJSON != null) {
                RevEntityMetadata revEntityMetadata = gson.fromJson(revEntityMetadataJSON.toString(), RevEntityMetadata.class);
                revEntityMetadata.set_resolveStatus(0);
                revEntityMetadataList.add(revEntityMetadata);
            }
        }

        return revEntityMetadataList;
    }

    private List<RevAnnotation> setRevAnnotationsList(JSONArray revEntityAnnotationsJSONArray) {
        List<RevAnnotation> annotationArrayList = new ArrayList<>();

        for (int i = 0; i < revEntityAnnotationsJSONArray.length(); i++) {
            JSONObject revEntityAnnotationJSON = null;
            try {
                revEntityAnnotationJSON = revEntityAnnotationsJSONArray.getJSONObject(i);
            } catch (JSONException e) {
                e.printStackTrace();
            }
            if (revEntityAnnotationJSON != null) {
                RevAnnotation revAnnotation = gson.fromJson(revEntityAnnotationJSON.toString(), RevAnnotation.class);
                revAnnotation.set_revAnnotationResStatus(0);
                annotationArrayList.add(revAnnotation);
            }
        }

        return annotationArrayList;
    }
}
